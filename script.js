// GLOBAL DATA
let water = parseInt(localStorage.getItem('water')) || 0;
let alarmTime = null;
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // NAVIGATION
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', () => showTab(item.getAttribute('data-tab')));
    });
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => showTab('dashboard'));
    });
    document.getElementById('mini-alarm-trigger').addEventListener('click', () => showTab('alarm-tab'));

    // WATER
    document.getElementById('drink-btn').addEventListener('click', () => { water++; save('water', water); updateUI(); });
    document.getElementById('reset-water').addEventListener('click', () => { water = 0; save('water', 0); updateUI(); });

    // DIARY
    document.getElementById('unlock-btn').addEventListener('click', () => {
        if(document.getElementById('diary-pin').value === "1234") {
            document.getElementById('diary-lock').style.display = 'none';
            document.getElementById('diary-box').style.display = 'block';
            document.getElementById('diary-text').value = localStorage.getItem('diary') || "";
        } else { alert("Wrong PIN!"); }
    });
    document.getElementById('save-diary-btn').addEventListener('click', () => {
        save('diary', document.getElementById('diary-text').value);
        alert("Saved! 🔒");
    });

    // ALARM
    document.getElementById('set-alarm-btn').addEventListener('click', () => {
        alarmTime = document.getElementById('alarm-time').value;
        alert("Alarm set! 🔔");
    });

    // DEGREE
    document.getElementById('add-sub-btn').addEventListener('click', () => {
        const val = document.getElementById('sub-input').value;
        if(val) { subjects.push({name: val, done: false}); save('subjects', subjects); renderDegree(); }
    });
});

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const isDash = id === 'dashboard';
    document.getElementById('dashboard-content').style.display = isDash ? 'block' : 'none';
    document.getElementById('main-header').style.display = isDash ? 'block' : 'none';
    if(id === 'degree-tab') renderDegree();
}

function updateUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = water;
    const badgeRow = document.getElementById('badge-display');
    if(badgeRow) {
        badgeRow.innerHTML = "";
        if(water >= 8) badgeRow.innerHTML += `<span class="badge-icon badge-unlocked">💎</span>`;
    }
}

function renderDegree() {
    const list = document.getElementById('sub-list');
    list.innerHTML = subjects.map((s, i) => `<li onclick="toggleSub(${i})">${s.name} ${s.done ? '✅' : '⏳'}</li>`).join('');
    const done = subjects.filter(s => s.done).length;
    document.getElementById('degree-bar').style.width = subjects.length ? (done/subjects.length)*100 + "%" : "0%";
}

function toggleSub(i) { subjects[i].done = !subjects[i].done; save('subjects', subjects); renderDegree(); }
function save(k, v) { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : v); }

setInterval(() => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    document.getElementById('mini-clock').innerText = time;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = time;
    if(alarmTime === time.substring(0,5)) { alert("⏰ REMINDER!"); alarmTime = null; }
}, 1000);