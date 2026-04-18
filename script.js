const affirmations = ["I am proud of how far I've come. ✨", "Focus on the step, not the mountain. 🏔️", "Ananya, everything is falling into place. 🎀"];
const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];
let breathingInterval = null;

// Persistent Data
let goals = JSON.parse(localStorage.getItem('userGoals')) || { steps: 10000, water: 8 };
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    document.getElementById('affirmation-text').innerText = affirmations[Math.floor(Math.random() * affirmations.length)];
    loadTasks();
    updateWaterUI();
    renderVisionBoard();
    updateFitnessUI();
    checkBadges();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const head = document.getElementById('main-header'), dash = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') { head.style.display = 'block'; dash.style.display = 'block'; checkBadges(); }
    else { head.style.display = 'none'; dash.style.display = 'none'; }
}

// BADGE LOGIC
function checkBadges() {
    const badgeRow = document.getElementById('badge-display');
    if (!badgeRow) return;
    badgeRow.innerHTML = "";
    const badgeList = [
        { id: 's', icon: '🏆', condition: steps >= goals.steps },
        { id: 'w', icon: '💎', condition: waterCount >= goals.water },
        { id: 't', icon: '⭐', condition: document.querySelectorAll('#todo-list li span[style*="line-through"]').length >= 3 }
    ];
    badgeList.forEach(b => {
        const span = document.createElement('span');
        span.innerText = b.icon;
        span.className = `badge-icon ${b.condition ? 'badge-unlocked' : ''}`;
        badgeRow.appendChild(span);
    });
}

// TASKS
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
        saveTasks(); checkBadges();
    };
    document.getElementById('todo-list').appendChild(li);
}
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span:first-child').forEach(s => tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }

// TARGETS & FITNESS
function updateStepGoal() {
    goals.steps = parseInt(document.getElementById('step-goal-input').value) || 10000;
    localStorage.setItem('userGoals', JSON.stringify(goals));
    updateFitnessUI();
}
function addSteps() {
    const val = parseInt(document.getElementById('step-input').value);
    if (val > 0) { steps += val; localStorage.setItem('userSteps', steps); updateFitnessUI(); document.getElementById('step-input').value = ""; }
}
function resetSteps() { steps = 0; localStorage.setItem('userSteps', 0); updateFitnessUI(); }
function updateFitnessUI() {
    if(document.getElementById('current-steps')) document.getElementById('current-steps').innerText = steps.toLocaleString();
    if(document.getElementById('step-goal-input')) document.getElementById('step-goal-input').value = goals.steps;
    const bar = document.getElementById('step-progress');
    if(bar) bar.style.width = Math.min((steps / goals.steps) * 100, 100) + "%";
    checkBadges();
}

// WATER
function updateWaterGoal() {
    goals.water = parseInt(document.getElementById('water-goal-input').value) || 8;
    localStorage.setItem('userGoals', JSON.stringify(goals));
    updateWaterUI();
}
function addWater() { waterCount++; localStorage.setItem('waterCount', waterCount); updateWaterUI(); }
function resetWater() { waterCount = 0; localStorage.setItem('waterCount', 0); updateWaterUI(); }
function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    if(document.getElementById('water-goal-input')) document.getElementById('water-goal-input').value = goals.water;
    const p = document.getElementById('plant-display');
    if(p) p.innerText = plants[Math.min(Math.floor(waterCount / (goals.water/6)), plants.length - 1)];
    checkBadges();
}

// (OTHER FEATURES: Timer, Diary, Vision, Breathe same as before...)
function unlockDiary() {
    if (document.getElementById('diary-pin').value === "1234") {
        document.getElementById('diary-lock').style.display = 'none';
        document.getElementById('diary-open').style.display = 'block';
        document.getElementById('diary-input').value = localStorage.getItem('secretNote') || "";
    } else { alert("Wrong PIN! 🎀"); }
}
function saveDiary() { localStorage.setItem('secretNote', document.getElementById('diary-input').value); alert("Saved! ✨"); }
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
    const g = document.getElementById('vision-grid'); if(!g) return; g.innerHTML = "";
    JSON.parse(localStorage.getItem('visionImages') || "[]").forEach(url => {
        const img = document.createElement('img'); img.src = url; img.className = 'vision-img'; g.appendChild(img);
    });
}
function startBreathing() {
    const circle = document.querySelector('.breathe-circle'), text = document.getElementById('breathe-text'), btn = document.getElementById('breathe-btn');
    if (breathingInterval) { clearInterval(breathingInterval); breathingInterval = null; circle.classList.remove('breathe-expand'); text.innerText = "Ready?"; btn.innerText = "Start"; return; }
    btn.innerText = "Stop";
    const cycle = () => {
        text.innerText = "Inhale..."; circle.classList.add('breathe-expand');
        setTimeout(() => { text.innerText = "Hold..."; setTimeout(() => { text.innerText = "Exhale..."; circle.classList.remove('breathe-expand'); }, 2000); }, 4000);
    };
    cycle(); breathingInterval = setInterval(cycle, 10000);
}