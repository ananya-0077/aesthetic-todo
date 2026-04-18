let water = parseInt(localStorage.getItem('w_now')) || 0;
let fNow = parseInt(localStorage.getItem('f_now')) || 0;
let jar = JSON.parse(localStorage.getItem('j_notes')) || [];
let ece = JSON.parse(localStorage.getItem('e_subs')) || [];
let orders = JSON.parse(localStorage.getItem('o_list')) || [];
let alarmT = null;

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'});

    // NAVIGATION (HARD-WIRED)
    document.querySelectorAll('.feature-item').forEach(item => {
        item.onclick = () => {
            const target = item.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            document.getElementById('main-header').style.display = 'none';
        };
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('dashboard').classList.add('active');
            document.getElementById('main-header').style.display = 'block';
            updateUI();
        };
    });

    // FEATURE LOGIC
    document.getElementById('w-add').onclick = () => { water++; save('w_now', water); updateUI(); checkWGoal(); };
    document.getElementById('w-reset').onclick = () => { water = 0; save('w_now', 0); updateUI(); };

    document.getElementById('j-add').onclick = () => {
        const val = document.getElementById('j-in').value;
        if(val) { jar.push(val); save('j_notes', jar); renderJar(); document.getElementById('j-in').value = ""; }
    };

    document.querySelectorAll('.m-opt').forEach(btn => {
        btn.onclick = () => {
            const color = btn.getAttribute('data-color');
            document.body.style.background = `linear-gradient(135deg, ${color} 0%, #e1f5fe 100%)`;
            document.getElementById('m-status').innerText = "Mood set! ✨";
            showToast("Mood Updated!");
        };
    });

    document.getElementById('deg-add').onclick = () => {
        const val = document.getElementById('deg-in').value;
        if(val) { ece.push({n: val, d: false}); save('e_subs', ece); renderECE(); document.getElementById('deg-in').value = ""; }
    };

    renderJar(); renderECE();
});

function updateUI() { document.getElementById('w-now').innerText = water; document.getElementById('f-now').innerText = fNow; }
function renderJar() { document.getElementById('j-list').innerHTML = jar.map(n => `<div class="gratitude-note">${n}</div>`).join(''); }
function renderECE() {
    const list = document.getElementById('deg-list');
    const done = ece.filter(s => s.d).length;
    list.innerHTML = ece.map((s, i) => `<li style="background:white; padding:10px; border-radius:10px; list-style:none; margin:5px; cursor:pointer; opacity:${s.d?0.5:1}" onclick="toggleECE(${i})">${s.n} ${s.d?'✅':'⏳'}</li>`).join('');
    document.getElementById('deg-bar').style.width = ece.length ? (done/ece.length)*100 + "%" : "0%";
}
window.toggleECE = (i) => { ece[i].d = !ece[i].d; save('e_subs', ece); renderECE(); };
function save(k, v) { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : v); }
function showToast(m) { const t = document.createElement('div'); t.className='toast'; t.innerText=m; document.getElementById('toast-container').appendChild(t); setTimeout(()=>t.remove(), 2500); }
function checkWGoal() { if(water == document.getElementById('w-goal').value) showToast("💎 Water Goal Reached!"); }

setInterval(() => {
    const t = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    document.getElementById('mini-clock').innerText = t;
}, 1000);