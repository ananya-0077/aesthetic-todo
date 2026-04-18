// --- Configuration & State ---
const affirmations = [
    "I am proud of how far I've come. ✨",
    "Ananya, you are doing great! 🎀",
    "Focus on the step, not the mountain. 🏔️",
    "Everything is falling into place. 🧸"
];
const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];
let breathingInterval = null;

// --- Custom Targets & Badges State ---
let goals = JSON.parse(localStorage.getItem('userGoals')) || { steps: 10000, water: 8 };
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;

// --- INITIALIZATION ---
window.onload = () => {
    // 1. Set Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    
    // 2. Set Random Affirmation
    document.getElementById('affirmation-text').innerText = affirmations[Math.floor(Math.random() * affirmations.length)];
    
    // 3. Load All Data
    loadTasks();
    updateWaterUI();
    renderVisionBoard();
    updateFitnessUI();
    checkBadges();
};

// --- NAVIGATION LOGIC ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    const head = document.getElementById('main-header');
    const dash = document.getElementById('dashboard-content');
    
    if (tabId === 'dashboard') {
        head.style.display = 'block';
        dash.style.display = 'block';
        checkBadges(); // Refresh badges when returning home
    } else {
        head.style.display = 'none';
        dash.style.display = 'none';
    }
}

// --- BADGE SYSTEM ---
function checkBadges() {
    const badgeRow = document.getElementById('badge-display');
    if (!badgeRow) return;

    badgeRow.innerHTML = "";
    
    const badgeList = [
        { id: 'step-badge', icon: '🏆', condition: steps >= goals.steps, label: 'Walker' },
        { id: 'water-badge', icon: '💎', condition: waterCount >= goals.water, label: 'Hydrated' },
        { id: 'task-badge', icon: '⭐', condition: document.querySelectorAll('#todo-list li span[style*="line-through"]').length >= 3, label: 'Achiever' }
    ];

    badgeList.forEach(b => {
        const span = document.createElement('span');
        span.innerText = b.icon;
        span.title = b.label;
        span.className = `badge-icon ${b.condition ? 'badge-unlocked' : ''}`;
        badgeRow.appendChild(span);
    });
}

// --- TASK LOGIC (Aesthetic Grid) ---
const tInput = document.getElementById('todo-input');
document.getElementById('add-btn').onclick = () => {
    if (tInput.value.trim()) { createTask(tInput.value); saveTasks(); tInput.value = ""; }
};

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `<span style="${completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${text}</span><span style="opacity:0.2">✨</span>`;
    li.onclick = () => {
        const s = li.querySelector('span');
        s.style.textDecoration = s.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        s.style.opacity = s.style.opacity === '0.5' ? '1' : '0.5';
        saveTasks();
        checkBadges();
    };
    document.getElementById('todo-list').appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span:first-child').forEach(s => {
        tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'});
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed));
}

// --- FITNESS & TARGET LOGIC ---
function updateStepGoal() {
    const newGoal = document.getElementById('step-goal-input').value;
    goals.steps = parseInt(newGoal) || 10000;
    localStorage.setItem('userGoals', JSON.stringify(goals));
    updateFitnessUI();
}

function addSteps() {
    const sInput = document.getElementById('step-input');
    const val = parseInt(sInput.value);
    if (val > 0) { 
        steps += val; 
        localStorage.setItem('userSteps', steps); 
        updateFitnessUI(); 
        sInput.value = ""; 
    }
}

function resetSteps() {
    if(confirm("Reset steps for a new day?")) {
        steps = 0;
        localStorage.setItem('userSteps', 0);
        updateFitnessUI();
    }
}

function updateFitnessUI() {
    if(document.getElementById('current-steps')) document.getElementById('current-steps').innerText = steps.toLocaleString();
    if(document.getElementById('step-goal-input')) document.getElementById('step-goal-input').value = goals.steps;
    
    const bar = document.getElementById('step-progress');
    if(bar) {
        const percent = (steps / goals.steps) * 100;
        bar.style.width = Math.min(percent, 100) + "%";
    }
    checkBadges();
}

// --- WATER LOGIC ---
function updateWaterGoal() {
    const newGoal = document.getElementById('water-goal-input').value;
    goals.water = parseInt(newGoal) || 8;
    localStorage.setItem('userGoals', JSON.stringify(goals));
    updateWaterUI();
}

function addWater() {
    waterCount++;
    localStorage.setItem('waterCount', waterCount);
    updateWaterUI();
}

function resetWater() {
    waterCount = 0;
    localStorage.setItem('waterCount', 0);
    updateWaterUI();
}

function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    if(document.getElementById('water-goal-input')) document.getElementById('water-goal-input').value = goals.water;
    
    const p = document.getElementById('plant-display');
    if(p) p.innerText = plants[Math.min(Math.floor(waterCount / (goals.water/6)), plants.length - 1)];
    checkBadges();
}

// --- TIMER LOGIC ---
let timeLeft = 25 * 60, timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');

startBtn.onclick = () => {
    if (timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; }
    else { 
        startBtn.innerText = "Pause"; 
        timerId = setInterval(() => {
            timeLeft--;
            let mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
            timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft <= 0) { clearInterval(timerId); alert("Break time, Ananya! 🌸"); }
        }, 1000); 
    }
};

document.getElementById('reset-timer').onclick = () => { 
    clearInterval(timerId); timerId = null; timeLeft = 25 * 60; 
    timerClock.innerText = "25:00"; startBtn.innerText = "Start"; 
};

// --- DIARY LOGIC ---
function unlockDiary() {
    if (document.getElementById('diary-pin').value === "1234") {
        document.getElementById('diary-lock').style.display = 'none';
        document.getElementById('diary-open').style.display = 'block';
        document.getElementById('diary-input').value = localStorage.getItem('secretNote') || "";
    } else { alert("Wrong PIN! 🎀"); }
}
function saveDiary() { localStorage.setItem('secretNote', document.getElementById('diary-input').value); alert("Saved! ✨"); }

// --- VISION BOARD ---
function addImage() {
    const url = document.getElementById('vision-url').value.trim();
    if (url) {
        let v = JSON.parse(localStorage.getItem('visionImages') || "[]");
        v.push(url);
        localStorage.setItem('visionImages', JSON.stringify(v));
        renderVisionBoard();
        document.getElementById('vision-url').value = "";
    }
}
function renderVisionBoard() {
    const g = document.getElementById('vision-grid');
    if(!g) return;
    g.innerHTML = "";
    JSON.parse(localStorage.getItem('visionImages') || "[]").forEach(url => {
        const img = document.createElement('img'); img.src = url; img.className = 'vision-img';
        g.appendChild(img);
    });
}

// --- BREATHE LOGIC ---
function startBreathing() {
    const circle = document.querySelector('.breathe-circle');
    const text = document.getElementById('breathe-text');
    const btn = document.getElementById('breathe-btn');
    if (breathingInterval) {
        clearInterval(breathingInterval); breathingInterval = null;
        circle.classList.remove('breathe-expand'); text.innerText = "Ready?"; btn.innerText = "Start";
        return;
    }
    btn.innerText = "Stop";
    const cycle = () => {
        text.innerText = "Inhale..."; circle.classList.add('breathe-expand');
        setTimeout(() => {
            text.innerText = "Hold...";
            setTimeout(() => { text.innerText = "Exhale..."; circle.classList.remove('breathe-expand'); }, 2000);
        }, 4000);
    };
    cycle(); breathingInterval = setInterval(cycle, 10000);
}