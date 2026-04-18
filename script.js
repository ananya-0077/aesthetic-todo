const affirmations = ["Ananya, you are doing great! ✨", "Focus on the step, not the mountain. 🏔️", "Everything is falling into place. 🎀"];
const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];
let breathingInterval = null, quizScore = 0;

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
    const h = document.getElementById('main-header'), d = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') { h.style.display = 'block'; d.style.display = 'block'; checkBadges(); }
    else { h.style.display = 'none'; d.style.display = 'none'; }
}

function checkBadges() {
    const row = document.getElementById('badge-display');
    if (!row) return;
    row.innerHTML = "";
    const badgeList = [
        { icon: '🏆', condition: steps >= goals.steps },
        { icon: '💎', condition: waterCount >= goals.water },
        { icon: '⭐', condition: quizScore >= 3 },
        { icon: '🎀', condition: document.querySelectorAll('#todo-list li span[style*="line-through"]').length >= 3 }
    ];
    badgeList.forEach(b => {
        const span = document.createElement('span');
        span.innerText = b.icon;
        span.className = `badge-icon ${b.condition ? 'badge-unlocked' : ''}`;
        row.appendChild(span);
    });
}

function triggerReward(msg) {
    alert(msg);
    checkBadges();
}

// Tasks
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

// Water
function updateWaterGoal() { goals.water = parseInt(document.getElementById('water-goal-input').value) || 8; localStorage.setItem('userGoals', JSON.stringify(goals)); updateWaterUI(); }
function addWater() { 
    waterCount++; localStorage.setItem('waterCount', waterCount); updateWaterUI(); 
    if(waterCount === goals.water) triggerReward("💎 CRYSTAL DROP UNLOCKED! Hydration goal met! ✨");
}
function resetWater() { waterCount = 0; localStorage.setItem('waterCount', 0); updateWaterUI(); }
function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    if(document.getElementById('water-goal-input')) document.getElementById('water-goal-input').value = goals.water;
    const p = document.getElementById('plant-display');
    if(p) p.innerText = plants[Math.min(Math.floor(waterCount / (goals.water/6)), plants.length - 1)];
    checkBadges();
}

// Fitness
function updateStepGoal() { goals.steps = parseInt(document.getElementById('step-goal-input').value) || 10000; localStorage.setItem('userGoals', JSON.stringify(goals)); updateFitnessUI(); }
function addSteps() { 
    const val = parseInt(document.getElementById('step-input').value); 
    if (val > 0) { 
        steps += val; localStorage.setItem('userSteps', steps); updateFitnessUI(); document.getElementById('step-input').value = ""; 
        if(steps >= goals.steps && steps < goals.steps + val) triggerReward("🏆 MOVEMENT MASTER! Goal crushed! 👟");
    } 
}
function resetSteps() { steps = 0; localStorage.setItem('userSteps', 0); updateFitnessUI(); }
function updateFitnessUI() {
    if(document.getElementById('current-steps')) document.getElementById('current-steps').innerText = steps.toLocaleString();
    if(document.getElementById('step-goal-input')) document.getElementById('step-goal-input').value = goals.steps;
    const bar = document.getElementById('step-progress');
    if(bar) bar.style.width = Math.min((steps / goals.steps) * 100, 100) + "%";
    checkBadges();
}

// Study Buddy
function startQuiz() {
    const n = document.getElementById('notes-input').value.trim();
    if(n.length < 3) return alert("Paste notes first! 📚");
    document.getElementById('study-initial').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'flex';
    document.getElementById('question-text').innerText = "Question 1: What is the main component used for voltage regulation in an ECE circuit?";
}
function checkAnswer() {
    const userAns = document.getElementById('answer-input').value.toLowerCase().trim();
    if(userAns.includes("zener") || userAns.includes("regulator") || userAns.includes("nand") || userAns.includes("nor")) {
        quizScore++;
        document.getElementById('quiz-score').innerText = quizScore;
        alert("Correct! ⭐");
        if(quizScore === 3) triggerReward("📚 STUDY STAR UNLOCKED! Brain power activated!");
        if (quizScore === 1) document.getElementById('question-text').innerText = "Question 2: Which logic gate is known as the 'Universal Gate'?";
        else if (quizScore === 2) document.getElementById('question-text').innerText = "Question 3: In Computer Vision, what does 'YOLO' stand for?";
        document.getElementById('answer-input').value = "";
    } else {
        alert("Not quite! Try again. 🧸");
    }
}

// Vision, Diary, Breathe, Timer
function unlockDiary() { if (document.getElementById('diary-pin').value === "1234") { document.getElementById('diary-lock').style.display = 'none'; document.getElementById('diary-open').style.display = 'block'; document.getElementById('diary-input').value = localStorage.getItem('secretNote') || ""; } else { alert("Wrong PIN! 🎀"); } }
function saveDiary() { localStorage.setItem('secretNote', document.getElementById('diary-input').value); alert("Saved! ✨"); }
function addImage() { const url = document.getElementById('vision-url').value.trim(); if (url) { let v = JSON.parse(localStorage.getItem('visionImages') || "[]"); v.push(url); localStorage.setItem('visionImages', JSON.stringify(v)); renderVisionBoard(); document.getElementById('vision-url').value = ""; } }
function renderVisionBoard() { const g = document.getElementById('vision-grid'); if(!g) return; g.innerHTML = ""; JSON.parse(localStorage.getItem('visionImages') || "[]").forEach(url => { const img = document.createElement('img'); img.src = url; img.className = 'vision-img'; g.appendChild(img); }); }
function startBreathing() { const circle = document.querySelector('.breathe-circle'), text = document.getElementById('breathe-text'), btn = document.getElementById('breathe-btn'); if (breathingInterval) { clearInterval(breathingInterval); breathingInterval = null; circle.classList.remove('breathe-expand'); text.innerText = "Ready?"; btn.innerText = "Start"; return; } btn.innerText = "Stop"; const cycle = () => { text.innerText = "Inhale..."; circle.classList.add('breathe-expand'); setTimeout(() => { text.innerText = "Hold..."; setTimeout(() => { text.innerText = "Exhale..."; circle.classList.remove('breathe-expand'); }, 2000); }, 4000); }; cycle(); breathingInterval = setInterval(cycle, 10000); }
let timeLeft = 25 * 60, timerId = null; const timerClock = document.getElementById('timer-clock'); const startBtn = document.getElementById('start-timer'); startBtn.onclick = () => { if (timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; } else { startBtn.innerText = "Pause"; timerId = setInterval(() => { timeLeft--; let mins = Math.floor(timeLeft / 60), secs = timeLeft % 60; timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`; if (timeLeft <= 0) { clearInterval(timerId); alert("Break time! 🌸"); } }, 1000); } }; document.getElementById('reset-timer').onclick = () => { clearInterval(timerId); timerId = null; timeLeft = 25 * 60; timerClock.innerText = "25:00"; startBtn.innerText = "Start"; };