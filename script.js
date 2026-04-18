const affirmations = ["Ananya, you are doing great! ✨", "Focus on the step, not the mountain. 🏔️", "Everything is falling into place. 🎀"];
const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];
let breathingInterval = null;

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    document.getElementById('affirmation-text').innerText = affirmations[Math.floor(Math.random() * affirmations.length)];
    loadTasks();
    updateWaterUI();
    renderVisionBoard();
    updateFitnessUI();
};

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    // Show the selected tab
    document.getElementById(tabId).classList.add('active');

    // Hide main header and tasks if not on dashboard
    const header = document.getElementById('main-header');
    const dashboardItems = document.getElementById('dashboard-content');
    
    if (tabId === 'dashboard') {
        header.style.display = 'block';
        dashboardItems.style.display = 'block';
    } else {
        header.style.display = 'none';
        dashboardItems.style.display = 'none';
    }
}

// Tasks
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
document.getElementById('add-btn').onclick = () => {
    if (todoInput.value.trim()) { createTask(todoInput.value); saveTasks(); todoInput.value = ""; }
};
function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.style.cssText = "list-style:none; background:white; margin:8px 0; padding:10px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;";
    li.innerHTML = `<span style="${completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${text}</span><button onclick="this.parentElement.remove(); saveTasks();" style="border:none; background:none; cursor:pointer;">☁️</button>`;
    li.onclick = (e) => {
        if(e.target.tagName !== 'BUTTON') {
            const s = li.querySelector('span');
            s.style.textDecoration = s.style.textDecoration === 'line-through' ? 'none' : 'line-through';
            s.style.opacity = s.style.opacity === '0.5' ? '1' : '0.5';
            saveTasks();
        }
    };
    todoList.appendChild(li);
}
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span').forEach(s => tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }

// Timer
let timeLeft = 25 * 60, timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');
if(startBtn) {
    startBtn.onclick = () => {
        if (timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; }
        else { startBtn.innerText = "Pause"; timerId = setInterval(() => {
            timeLeft--;
            let mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
            timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft <= 0) { clearInterval(timerId); alert("Break time! 🌸"); }
        }, 1000); }
    };
}
document.getElementById('reset-timer').onclick = () => { clearInterval(timerId); timerId = null; timeLeft = 25 * 60; timerClock.innerText = "25:00"; startBtn.innerText = "Start"; };

// Water
let waterCount = localStorage.getItem('waterCount') || 0;
function addWater() { if (waterCount < 8) { waterCount++; updateWaterUI(); localStorage.setItem('waterCount', waterCount); } }
function resetWater() { waterCount = 0; updateWaterUI(); localStorage.setItem('waterCount', waterCount); }
function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    const p = document.getElementById('plant-display');
    if(p) p.innerText = plants[Math.min(Math.floor(waterCount / 1.2), plants.length - 1)];
}

// Diary
function unlockDiary() {
    if (document.getElementById('diary-pin').value === "1234") {
        document.getElementById('diary-lock').style.display = 'none';
        document.getElementById('diary-open').style.display = 'block';
        document.getElementById('diary-input').value = localStorage.getItem('secretNote') || "";
    } else { alert("Wrong PIN! 🎀"); }
}
function saveDiary() { localStorage.setItem('secretNote', document.getElementById('diary-input').value); alert("Saved! ✨"); }

// Vision Board
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

// Breathe
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
// --- Feature 6: Fitness Logic ---
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
const stepGoal = 10000;

function addSteps() {
    const input = document.getElementById('step-input');
    const amount = parseInt(input.value);
    
    if (amount > 0) {
        steps += amount;
        updateFitnessUI();
        localStorage.setItem('userSteps', steps);
        input.value = "";
    }
}

function resetSteps() {
    if(confirm("Start a new fitness day?")) {
        steps = 0;
        updateFitnessUI();
        localStorage.setItem('userSteps', 0);
    }
}

function updateFitnessUI() {
    const stepText = document.getElementById('current-steps');
    const bar = document.getElementById('step-progress');
    
    if(stepText && bar) {
        stepText.innerText = steps.toLocaleString();
        let percentage = Math.min((steps / stepGoal) * 100, 100);
        bar.style.width = percentage + "%";
        
        if (steps >= stepGoal) {
            stepText.style.color = "#4db6ac"; // Turns green when goal met
        }
    }
}

// Add 'updateFitnessUI();' to your window.onload function at the top!