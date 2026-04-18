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
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const head = document.getElementById('main-header');
    const dash = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') { head.style.display = 'block'; dash.style.display = 'block'; }
    else { head.style.display = 'none'; dash.style.display = 'none'; }
}

// Tasks
const tInput = document.getElementById('todo-input');
document.getElementById('add-btn').onclick = () => {
    if (tInput.value.trim()) { createTask(tInput.value); saveTasks(); tInput.value = ""; }
};
function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `<span style="${completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${text}</span><span style="opacity:0.2">☁️</span>`;
    li.onclick = () => {
        const s = li.querySelector('span');
        s.style.textDecoration = s.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        s.style.opacity = s.style.opacity === '0.5' ? '1' : '0.5';
        saveTasks();
    };
    document.getElementById('todo-list').appendChild(li);
}
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span:first-child').forEach(s => tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }

// Timer
let timeLeft = 25 * 60, timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');
startBtn.onclick = () => {
    if (timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; }
    else { startBtn.innerText = "Pause"; timerId = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
        timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) { clearInterval(timerId); alert("Break time! 🌸"); }
    }, 1000); }
};
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

// Fitness
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
function addSteps() {
    const sInput = document.getElementById('step-input');
    if (parseInt(sInput.value) > 0) { steps += parseInt(sInput.value); updateFitnessUI(); localStorage.setItem('userSteps', steps); sInput.value = ""; }
}
function resetSteps() { steps = 0; updateFitnessUI(); localStorage.setItem('userSteps', 0); }
function updateFitnessUI() {
    if(document.getElementById('current-steps')) document.getElementById('current-steps').innerText = steps.toLocaleString();
    if(document.getElementById('step-progress')) document.getElementById('step-progress').style.width = Math.min((steps / 10000) * 100, 100) + "%";
}