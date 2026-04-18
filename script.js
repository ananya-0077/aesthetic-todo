const oracleAdvice = ["Trust the timing of your life. 🌿", "ECE labs require Taurus patience. 🎨", "Hydrate to create. 🎀", "A cozy break is productive. 🧸"];
let goals = { steps: 10000, water: 8, sleep: 8 };
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
let subjects = JSON.parse(localStorage.getItem('eceSubjects')) || [];
let alarmTime = null;
let timerId = null, timeLeft = 25 * 60, breathingInterval = null;

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    loadTasks(); loadBigThree(); updateWaterUI(); updateFitnessUI(); renderSubjects(); renderJar(); renderOrders(); initTimer();
};

// CLOCK & ALARM
setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    if(document.getElementById('mini-clock')) document.getElementById('mini-clock').innerText = timeStr;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = timeStr;
    if(alarmTime === timeStr.substring(0,5)) { alert("⏰ ALARM: " + (document.getElementById('alarm-note').value || "Goal Check!")); alarmTime = null; }
}, 1000);

function setAlarm() { alarmTime = document.getElementById('alarm-time-input').value; alert("Alarm set! 🔔"); }

// NAVIGATION
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const h = document.getElementById('main-header'), d = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') { h.style.display = 'block'; d.style.display = 'block'; checkBadges(); }
    else { h.style.display = 'none'; d.style.display = 'none'; }
}

// BREATHE
function startBreathing() {
    const circle = document.querySelector('.breathe-circle'), text = document.getElementById('breathe-text'), btn = document.getElementById('breathe-btn');
    if (breathingInterval) { clearInterval(breathingInterval); breathingInterval = null; circle.classList.remove('breathe-expand'); text.innerText = "Ready?"; btn.innerText = "Start"; return; }
    btn.innerText = "Stop";
    const cycle = () => { text.innerText = "Inhale..."; circle.classList.add('breathe-expand'); setTimeout(() => { text.innerText = "Exhale..."; circle.classList.remove('breathe-expand'); }, 4000); };
    cycle(); breathingInterval = setInterval(cycle, 8000);
}

// DEGREE TRACKER
function addSubject() {
    const input = document.getElementById('subject-input');
    if(input.value) { subjects.push({name: input.value, done: false}); input.value = ""; renderSubjects(); }
}
function renderSubjects() {
    const list = document.getElementById('subject-list'); list.innerHTML = "";
    let doneCount = 0;
    subjects.forEach((s, i) => {
        if(s.done) doneCount++;
        const li = document.createElement('li'); li.innerHTML = `<span>${s.name}</span> <span>${s.done ? '✅' : '⏳'}</span>`;
        li.style.opacity = s.done ? "0.5" : "1";
        li.onclick = () => { subjects[i].done = !subjects[i].done; renderSubjects(); };
        list.appendChild(li);
    });
    const prog = subjects.length ? (doneCount/subjects.length)*100 : 0;
    document.getElementById('degree-progress-bar').style.width = prog + "%";
    document.getElementById('progress-percent').innerText = Math.round(prog) + "% Completed";
    localStorage.setItem('eceSubjects', JSON.stringify(subjects));
}

// DIARY
function unlockDiary() { if(document.getElementById('diary-pin').value === "1234") { document.getElementById('diary-lock-screen').style.display='none'; document.getElementById('diary-editor').style.display='block'; document.getElementById('diary-content').value = localStorage.getItem('diaryText') || ""; } else alert("Wrong PIN!"); }
function saveDiary() { localStorage.setItem('diaryText', document.getElementById('diary-content').value); alert("Saved! 🔒"); }

// BADGES
function checkBadges() {
    const row = document.getElementById('badge-display'); if(!row) return; row.innerHTML = "";
    const sleep = parseFloat(localStorage.getItem('sleepHours')) || 0;
    const badgeList = [{ i: '🏆', c: steps >= goals.steps }, { i: '💎', c: waterCount >= goals.water }, { i: '☁️', c: sleep >= 8 }, { i: '🎀', c: document.querySelectorAll('#todo-list li span[style*="line-through"]').length >= 3 }];
    badgeList.forEach(b => { const span = document.createElement('span'); span.innerText = b.i; span.className = `badge-icon ${b.c ? 'badge-unlocked badge-bounce' : ''}`; row.appendChild(span); });
}

// TIMERS & CORE
function initTimer() {
    const startBtn = document.getElementById('start-timer'), clock = document.getElementById('timer-clock');
    if(!startBtn) return;
    startBtn.onclick = () => {
        if(timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; }
        else { startBtn.innerText = "Pause"; timerId = setInterval(() => { timeLeft--; let m = Math.floor(timeLeft/60), s = timeLeft%60; clock.innerText = `${m}:${s<10?'0':''}${s}`; if(timeLeft<=0) { clearInterval(timerId); alert("Time for a break! 🌸"); } }, 1000); }
    };
    document.getElementById('reset-timer').onclick = () => { clearInterval(timerId); timerId = null; timeLeft = 25*60; clock.innerText = "25:00"; startBtn.innerText = "Start"; };
}

// UTILS (Water, Fitness, etc)
function updateWaterUI() { document.getElementById('water-count').innerText = waterCount; checkBadges(); }
function addWater() { waterCount++; localStorage.setItem('waterCount', waterCount); updateWaterUI(); if(waterCount===goals.water) alert("💎 Hydration Goal Met!"); }
function updateFitnessUI() { document.getElementById('current-steps').innerText = steps.toLocaleString(); document.getElementById('step-progress').style.width = Math.min((steps/goals.steps)*100, 100) + "%"; checkBadges(); }
function addSteps() { steps += 1000; localStorage.setItem('userSteps', steps); updateFitnessUI(); if(steps===goals.steps) alert("🏆 Step Goal Met!"); }
function saveSleep() { const h = document.getElementById('sleep-hours').value; localStorage.setItem('sleepHours', h); alert("Sleep logged! ☁️"); checkBadges(); }
function loadBigThree() { const data = JSON.parse(localStorage.getItem('bigThree')); if(data) { document.getElementById('big1').value = data.b1; document.getElementById('big2').value = data.b2; document.getElementById('big3').value = data.b3; } }
function saveBigThree() { const data = { b1: document.getElementById('big1').value, b2: document.getElementById('big2').value, b3: document.getElementById('big3').value }; localStorage.setItem('bigThree', JSON.stringify(data)); }
function flipCard() { const card = document.getElementById('oracle-card'); card.innerText = oracleAdvice[Math.floor(Math.random() * oracleAdvice.length)]; card.style.background = "white"; card.style.color = "#5d4037"; setTimeout(() => { card.innerText = "Flip for Taurus Guidance 🔮"; card.style.background = ""; card.style.color = "white"; }, 5000); }
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }
function createTask(text, completed = false) { const li = document.createElement('li'); li.innerHTML = `<span>${text}</span>`; if(completed) li.style.textDecoration = "line-through"; li.onclick = () => { li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through'; saveTasks(); checkBadges(); }; document.getElementById('todo-list').appendChild(li); }
function saveTasks() { const tasks = []; document.querySelectorAll('#todo-list li').forEach(li => tasks.push({text: li.innerText, completed: li.style.textDecoration === 'line-through'})); localStorage.setItem('tasks', JSON.stringify(tasks)); }
document.getElementById('add-btn').onclick = () => { const t = document.getElementById('todo-input'); if(t.value) { createTask(t.value); saveTasks(); t.value = ""; } };