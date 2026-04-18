// --- STATE ---
let wNow = parseInt(localStorage.getItem('wNow')) || 0;
let fNow = parseInt(localStorage.getItem('fNow')) || 0;
let wGoal = parseInt(localStorage.getItem('wGoal')) || 8;
let fGoal = parseInt(localStorage.getItem('fGoal')) || 10000;
let subjects = JSON.parse(localStorage.getItem('eceSubs')) || [];
let alarmTime = null;
let timerId = null, timeLeft = 25 * 60;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    
    // 2. Tab Navigation
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-target');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.getElementById('main-header').style.display = (id === 'dashboard') ? 'block' : 'none';
        });
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('dashboard').classList.add('active');
            document.getElementById('main-header').style.display = 'block';
            updateUI();
        });
    });

    // 3. Water Logic
    document.getElementById('w-add').addEventListener('click', () => { wNow++; save('wNow', wNow); updateUI(); });
    document.getElementById('w-reset').addEventListener('click', () => { wNow = 0; save('wNow', 0); updateUI(); });
    document.getElementById('w-goal').addEventListener('change', (e) => { wGoal = e.target.value; save('wGoal', wGoal); updateUI(); });

    // 4. Fitness Logic
    document.getElementById('f-add').addEventListener('click', () => { fNow += 1000; save('fNow', fNow); updateUI(); });
    document.getElementById('f-reset').addEventListener('click', () => { fNow = 0; save('fNow', 0); updateUI(); });
    document.getElementById('f-goal').addEventListener('change', (e) => { fGoal = e.target.value; save('fGoal', fGoal); updateUI(); });

    // 5. Alarm logic
    document.getElementById('al-set').addEventListener('click', () => {
        alarmTime = document.getElementById('al-time').value;
        document.getElementById('al-status').innerText = `🔔 Reminder set for ${alarmTime}`;
        alert("Alarm active! ✨");
    });

    // 6. Diary Lock
    document.getElementById('d-unlock').addEventListener('click', () => {
        if(document.getElementById('d-pin').value === "1234") {
            document.getElementById('diary-lock').style.display = 'none';
            document.getElementById('diary-open').style.display = 'block';
            document.getElementById('d-area').value = localStorage.getItem('dText') || "";
        } else alert("Wrong PIN!");
    });
    document.getElementById('d-save').addEventListener('click', () => { save('dText', document.getElementById('d-area').value); alert("Secret Saved! 🔒"); });

    // 7. Degree Tracker
    document.getElementById('deg-add').addEventListener('click', () => {
        const val = document.getElementById('deg-in').value;
        if(val) { subjects.push({n: val, d: false}); save('eceSubs', subjects); renderDeg(); document.getElementById('deg-in').value = ""; }
    });

    updateUI();
});

function updateUI() {
    document.getElementById('w-now').innerText = wNow;
    document.getElementById('w-goal').value = wGoal;
    document.getElementById('f-now').innerText = fNow.toLocaleString();
    document.getElementById('f-goal').value = fGoal;
    document.getElementById('f-bar').style.width = Math.min((fNow/fGoal)*100, 100) + "%";
}

function renderDeg() {
    const list = document.getElementById('deg-list');
    list.innerHTML = subjects.map((s, i) => `<li style="background:white; padding:10px; border-radius:10px; list-style:none; margin:5px; cursor:pointer; opacity:${s.d?0.5:1}" onclick="toggleDeg(${i})">${s.n} ${s.d ? '✅' : '⏳'}</li>`).join('');
    const done = subjects.filter(s => s.d).length;
    document.getElementById('deg-bar').style.width = subjects.length ? (done/subjects.length)*100 + "%" : "0%";
}
window.toggleDeg = (i) => { subjects[i].d = !subjects[i].d; save('eceSubs', subjects); renderDeg(); };

function save(k, v) { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : v); }

setInterval(() => {
    const now = new Date();
    const t = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    document.getElementById('mini-clock').innerText = t;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = t;
    if(alarmTime === t.substring(0,5)) { alert("⏰ REMINDER!"); alarmTime = null; }
}, 1000);