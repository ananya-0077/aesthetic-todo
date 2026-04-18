// DATA PERSISTENCE
let wNow = parseInt(localStorage.getItem('w_now')) || 0;
let fNow = parseInt(localStorage.getItem('f_now')) || 0;
let jar = JSON.parse(localStorage.getItem('jar_notes')) || [];
let alarmT = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI Setup
    updateUI();
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'});

    // 2. Navigation Logic
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            document.getElementById('main-header').style.display = 'none';
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
    document.getElementById('w-add').onclick = () => { wNow++; localStorage.setItem('w_now', wNow); updateUI(); };
    document.getElementById('w-reset').onclick = () => { wNow = 0; localStorage.setItem('w_now', 0); updateUI(); };

    // 4. Fitness Logic
    document.getElementById('f-add').onclick = () => { fNow += 1000; localStorage.setItem('f_now', fNow); updateUI(); };
    document.getElementById('f-reset').onclick = () => { fNow = 0; localStorage.setItem('f_now', 0); updateUI(); };

    // 5. Jar Logic
    document.getElementById('jar-add').onclick = () => {
        const val = document.getElementById('jar-input').value;
        if(val) { jar.push(val); localStorage.setItem('jar_notes', JSON.stringify(jar)); renderJar(); document.getElementById('jar-input').value = ""; }
    };

    // 6. Mood Logic
    document.querySelectorAll('.m-opt').forEach(btn => {
        btn.onclick = () => {
            const color = btn.getAttribute('data-color');
            document.body.style.background = `linear-gradient(135deg, ${color} 0%, #e1f5fe 100%)`;
            document.getElementById('mood-txt').innerText = "Vibe updated! ✨";
        };
    });

    // 7. Alarm logic
    document.getElementById('al-set').onclick = () => { alarmT = document.getElementById('al-time').value; alert("Alarm Set! 🔔"); };

    renderJar();
});

function updateUI() {
    document.getElementById('w-now').innerText = wNow;
    document.getElementById('f-now').innerText = fNow.toLocaleString();
    const fGoal = parseInt(document.getElementById('f-goal').value);
    document.getElementById('f-bar').style.width = Math.min((fNow / fGoal) * 100, 100) + "%";
}

function renderJar() {
    const g = document.getElementById('jar-grid');
    if(!g) return;
    g.innerHTML = jar.map(n => `<div class="gratitude-note" style="background:#fff9c4; padding:8px; margin:5px; border-radius:5px; font-size:0.7rem;">${n}</div>`).join('');
}

setInterval(() => {
    const t = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    if(document.getElementById('mini-clock')) document.getElementById('mini-clock').innerText = t;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = t;
    if(alarmT === t.substring(0,5)) { alert("⏰ REMINDER!"); alarmT = null; }
}, 1000);