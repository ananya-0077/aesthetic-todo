let water = parseInt(localStorage.getItem('water')) || 0;
let alarmTime = null;
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    updateUI();

    // 2. Navigation Logic (Crucial Fix)
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-tab');
            changeTab(target);
        });
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => changeTab('dashboard'));
    });

    document.getElementById('mini-alarm-trigger').addEventListener('click', () => changeTab('alarm-tab'));

    // 3. Feature Logic
    document.getElementById('drink-btn').addEventListener('click', () => { water++; save('water', water); updateUI(); });
    document.getElementById('reset-water').addEventListener('click', () => { water = 0; save('water', 0); updateUI(); });

    document.getElementById('unlock-btn').addEventListener('click', () => {
        if(document.getElementById('diary-pin').value === "1234") {
            document.getElementById('diary-lock').style.display = 'none';
            document.getElementById('diary-editor').style.display = 'block';
            document.getElementById('diary-text').value = localStorage.getItem('diary') || "";
        } else { alert("Wrong PIN!"); }
    });

    document.getElementById('save-diary-btn').addEventListener('click', () => {
        save('diary', document.getElementById('diary-text').value);
        alert("Saved! 🔒");
    });

    document.getElementById('set-alarm-btn').addEventListener('click', () => {
        alarmTime = document.getElementById('alarm-time-val').value;
        alert("Alarm set! 🔔");
    });
});

function changeTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // Manage Dashboard Visibility
    const header = document.getElementById('main-header');
    header.style.display = (id === 'dashboard') ? 'block' : 'none';
}

function updateUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = water;
}

function save(k, v) { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : v); }

setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    document.getElementById('mini-clock').innerText = timeStr;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = timeStr;
    if(alarmTime === timeStr.substring(0,5)) { alert("⏰ REMINDER!"); alarmTime = null; }
}, 1000);