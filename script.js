const affirmations = [
    "I am proud of how far I've come.",
    "Ananya, you are doing great! ✨",
    "Focus on the step, not the mountain. 🏔️",
    "Everything is falling into place. 🎀"
];

const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];
let breathingInterval = null;

// --- INITIALIZATION ---
window.onload = () => {
    // 1. Set Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    
    // 2. Set Random Affirmation
    document.getElementById('affirmation-text').innerText = affirmations[Math.floor(Math.random() * affirmations.length)];
    
    // 3. Load Data
    loadTasks();
    updateWaterUI();
    renderVisionBoard();
};

// --- NAVIGATION LOGIC (The Aesthetic Fix) ---
function showTab(tabId) {
    // 1. Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // 2. Show the selected tab
    document.getElementById(tabId).classList.add('active');

    // 3. Hide Dashboard Header/Input when in a Feature
    const dashboardContent = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') {
        dashboardContent.style.display = 'block';
    } else {
        dashboardContent.style.display = 'none';
    }
}

// --- TASK LOGIC ---
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

document.getElementById('add-btn').onclick = () => {
    if (input.value.trim()) { 
        createTask(input.value); 
        saveTasks(); 
        input.value = ""; 
    }
};

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.style.cssText = "list-style:none; background:white; margin:8px 0; padding:12px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);";
    
    li.innerHTML = `
        <span class="task-text" style="${completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${text}</span> 
        <button onclick="this.parentElement.remove(); saveTasks();" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">☁️</button>
    `;

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
    document.querySelectorAll('#todo-list li span').forEach(s => {
        tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'});
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks') || "[]");
    saved.forEach(t => createTask(t.text, t.completed));
}

// --- FEATURE 1: TIMER ---
let timeLeft = 25 * 60, timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');

if(startBtn) {
    startBtn.onclick = () => {
        if (timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; }
        else { 
            startBtn.innerText = "Pause"; 
            timerId = setInterval(() => {
                timeLeft--;
                let mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
                timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                if (timeLeft <= 0) { clearInterval(timerId); alert("Study break time! 🌸"); }
            }, 1000); 
        }
    };
}

document.getElementById('reset-timer').onclick = () => { 
    clearInterval(timerId); timerId = null; timeLeft = 25 * 60; 
    timerClock.innerText = "25:00"; startBtn.innerText = "Start"; 
};

// --- FEATURE 2: WATER ---
let waterCount = localStorage.getItem('waterCount') || 0;
function addWater() { if (waterCount < 8) { waterCount++; updateWaterUI(); localStorage.setItem('waterCount', waterCount); } }
function resetWater() { waterCount = 0; updateWaterUI(); localStorage.setItem('waterCount', waterCount); }
function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    const p = document.getElementById('plant-display');
    if(p) p.innerText = plants[Math.min(Math.floor(waterCount / 1.2), plants.length - 1)];
}

// --- FEATURE 3: DIARY ---
function unlockDiary() {
    if (document.getElementById('diary-pin').value === "1234") {
        document.getElementById('diary-lock').style.display = 'none';
        document.getElementById('diary-open').style.display = 'block';
        document.getElementById('diary-input').value = localStorage.getItem('secretNote') || "";
    } else { alert("Wrong PIN! 🎀"); }
}
function saveDiary() { localStorage.setItem('secretNote', document.getElementById('diary-input').value); alert("Saved safely! ✨"); }

// --- FEATURE 4: VISION BOARD ---
function addImage() {
    const urlInput = document.getElementById('vision-url');
    const url = urlInput.value.trim();
    if (url) {
        let v = JSON.parse(localStorage.getItem('visionImages') || "[]");
        v.push(url);
        localStorage.setItem('visionImages', JSON.stringify(v));
        renderVisionBoard();
        urlInput.value = "";
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

// --- FEATURE 5: BREATHE ---
function startBreathing() {
    const circle = document.querySelector('.breathe-circle');
    const text = document.getElementById('breathe-text');
    const btn = document.getElementById('breathe-btn');

    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
        circle.classList.remove('breathe-expand');
        text.innerText = "Ready?";
        btn.innerText = "Start";
        return;
    }

    btn.innerText = "Stop";
    const cycle = () => {
        text.innerText = "Inhale...";
        circle.classList.add('breathe-expand');
        setTimeout(() => {
            text.innerText = "Hold...";
            setTimeout(() => {
                text.innerText = "Exhale...";
                circle.classList.remove('breathe-expand');
            }, 2000);
        }, 4000);
    };
    cycle();
    breathingInterval = setInterval(cycle, 10000);
}

// Global Mood Function
function setMood(e) { alert(`Mood: ${e} logged. Take care, Ananya! ✨`); }