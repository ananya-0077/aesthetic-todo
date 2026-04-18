let goals = JSON.parse(localStorage.getItem('userGoals')) || { steps: 10000, water: 8 };
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
let alarmTime = null;
let timerId = null, timeLeft = 25 * 60;

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    updateWaterUI();
    updateFitnessUI();
    initTimer();
    checkBadges();
};

// CLOCK & ALARM
setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    if(document.getElementById('mini-clock')) document.getElementById('mini-clock').innerText = timeStr;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = timeStr;
    
    if(alarmTime === timeStr.substring(0,5)) {
        alert("⏰ REMINDER: " + (document.getElementById('alarm-note').value || "Check your Sanctuary!"));
        alarmTime = null;
        document.getElementById('alarm-msg').innerText = "";
    }
}, 1000);

function setAlarm() {
    alarmTime = document.getElementById('alarm-time-input').value;
    if(alarmTime) {
        document.getElementById('alarm-msg').innerText = "🔔 Active for " + alarmTime;
        alert("Reminder set! ✨");
    }
}

// NAVIGATION
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (tabId === 'dashboard') checkBadges();
}

// WATER LOGIC (WITH RESET)
function addWater() {
    waterCount++;
    localStorage.setItem('waterCount', waterCount);
    updateWaterUI();
    if(waterCount === goals.water) alert("💎 Hydration Goal Met! You're glowing!");
}
function resetWater() {
    waterCount = 0;
    localStorage.setItem('waterCount', 0);
    updateWaterUI();
}
function updateWaterUI() {
    document.getElementById('water-count').innerText = waterCount;
    document.getElementById('water-goal-input').value = goals.water;
    checkBadges();
}
function updateWaterGoal() {
    goals.water = parseInt(document.getElementById('water-goal-input').value);
    localStorage.setItem('userGoals', JSON.stringify(goals));
    checkBadges();
}

// FITNESS LOGIC (WITH RESET)
function addSteps() {
    steps += 1000;
    localStorage.setItem('userSteps', steps);
    updateFitnessUI();
    if(steps >= goals.steps && steps < goals.steps + 1000) alert("🏆 Step Goal Crushed!");
}
function resetSteps() {
    steps = 0;
    localStorage.setItem('userSteps', 0);
    updateFitnessUI();
}
function updateFitnessUI() {
    document.getElementById('current-steps').innerText = steps.toLocaleString();
    document.getElementById('step-goal-input').value = goals.steps;
    document.getElementById('step-progress').style.width = Math.min((steps/goals.steps)*100, 100) + "%";
    checkBadges();
}
function updateStepGoal() {
    goals.steps = parseInt(document.getElementById('step-goal-input').value);
    localStorage.setItem('userGoals', JSON.stringify(goals));
    updateFitnessUI();
}

// BADGE CHECK
function checkBadges() {
    const row = document.getElementById('badge-display');
    if(!row) return;
    row.innerHTML = "";
    const badgeList = [
        { i: '🏆', c: steps >= goals.steps },
        { i: '💎', c: waterCount >= goals.water },
        { i: '🎀', c: false } // Task badge logic
    ];
    badgeList.forEach(b => {
        const span = document.createElement('span');
        span.innerText = b.i;
        span.className = `badge-icon ${b.c ? 'badge-unlocked' : ''}`;
        row.appendChild(span);
    });
}

// TIMER
function initTimer() {
    const startBtn = document.getElementById('start-timer'), clock = document.getElementById('timer-clock');
    if(!startBtn) return;
    startBtn.onclick = () => {
        if(timerId) {
            clearInterval(timerId); timerId = null; startBtn.innerText = "Start";
        } else {
            startBtn.innerText = "Pause";
            timerId = setInterval(() => {
                timeLeft--;
                let m = Math.floor(timeLeft/60), s = timeLeft%60;
                clock.innerText = `${m}:${s<10?'0':''}${s}`;
                if(timeLeft<=0) { clearInterval(timerId); alert("Focus session done! 🌸"); }
            }, 1000);
        }
    };
    document.getElementById('reset-timer').onclick = () => {
        clearInterval(timerId); timerId = null; timeLeft = 25*60;
        clock.innerText = "25:00"; startBtn.innerText = "Start";
    };
}