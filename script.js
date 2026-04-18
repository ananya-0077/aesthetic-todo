let water = parseInt(localStorage.getItem('an_w')) || 0;
let fitness = parseInt(localStorage.getItem('an_f')) || 0;
let jar = JSON.parse(localStorage.getItem('an_j')) || [];
let ece = JSON.parse(localStorage.getItem('an_e')) || [];
let orders = JSON.parse(localStorage.getItem('an_o')) || [];
let alarmT = null;

document.addEventListener('DOMContentLoaded', () => {
    updateAll();
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'});

    // NAVIGATION
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
            updateAll();
        };
    });

    // FEATURE ACTIONS
    document.getElementById('w-add').onclick = () => { water++; save('an_w', water); updateAll(); if(water == document.getElementById('w-goal').value) showToast("💎 Water Goal Met!"); };
    document.getElementById('w-reset').onclick = () => { water = 0; save('an_w', 0); updateAll(); };
    
    document.getElementById('f-add').onclick = () => { fitness += 1000; save('an_f', fitness); updateAll(); };
    document.getElementById('f-reset').onclick = () => { fitness = 0; save('an_f', 0); updateAll(); };

    document.getElementById('j-add').onclick = () => {
        const val = document.getElementById('j-in').value;
        if(val) { jar.push(val); save('an_j', jar); renderJar(); document.getElementById('j-in').value = ""; }
    };

    document.getElementById('deg-add').onclick = () => {
        const val = document.getElementById('deg-in').value;
        if(val) { ece.push({n: val, d: false}); save('an_e', ece); renderECE(); document.getElementById('deg-in').value = ""; }
    };

    document.getElementById('o-add').onclick = () => {
        const n = document.getElementById('o-name').value, i = document.getElementById('o-item').value;
        if(n && i) { orders.push({n, i}); save('an_o', orders); renderOrders(); document.getElementById('o-name').value=""; document.getElementById('o-item').value=""; }
    };

    document.querySelectorAll('.m-opt').forEach(btn => {
        btn.onclick = () => {
            document.body.style.background = `linear-gradient(135deg, ${btn.dataset.color} 0%, #e1f5fe 100%)`;
            document.getElementById('m-status').innerText = "Vibe updated! ✨";
            showToast("Mood Set!");
        };
    });

    document.getElementById('d-unlock').onclick = () => {
        if(document.getElementById('d-pin').value === "1234") {
            document.getElementById('d-lock').style.display = 'none';
            document.getElementById('d-open').style.display = 'block';
            document.getElementById('d-area').value = localStorage.getItem('an_d_text') || "";
        } else alert("Wrong PIN!");
    };
    document.getElementById('d-save').onclick = () => { localStorage.setItem('an_d_text', document.getElementById('d-area').value); showToast("🔒 Saved!"); };

    document.getElementById('al-set').onclick = () => { alarmT = document.getElementById('al-time').value; showToast("Alarm Set!"); };
});

function updateAll() {
    document.getElementById('w-now').innerText = water;
    document.getElementById('f-now').innerText = fitness.toLocaleString();
    const fGoal = document.getElementById('f-goal').value;
    document.getElementById('f-bar').style.width = Math.min((fitness/fGoal)*100, 100) + "%";
    renderJar(); renderECE(); renderOrders();
}

function renderJar() { document.getElementById('j-list').innerHTML = jar.map(n => `<div class="gratitude-note">${n}</div>`).join(''); }
function renderECE() {
    const list = document.getElementById('deg-list');
    const done = ece.filter(s => s.d).length;
    list.innerHTML = ece.map((s, i) => `<li style="background:white; padding:10px; border-radius:10px; list-style:none; margin:5px; cursor:pointer; opacity:${s.d?0.5:1}" onclick="toggleECE(${i})">${s.n} ${s.d?'✅':'⏳'}</li>`).join('');
    document.getElementById('deg-bar').style.width = ece.length ? (done/ece.length)*100 + "%" : "0%";
}
window.toggleECE = (i) => { ece[i].d = !ece[i].d; save('an_e', ece); renderECE(); };
function renderOrders() { document.getElementById('o-list').innerHTML = orders.map(o => `<li><span>${o.n}</span><span>${o.i}</span></li>`).join(''); }
function save(k, v) { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : v); }
function showToast(m) { const t = document.createElement('div'); t.className='toast'; t.innerText=m; document.getElementById('toast-container').appendChild(t); setTimeout(()=>t.remove(), 2500); }

setInterval(() => {
    const t = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
    document.getElementById('mini-clock').innerText = t;
    if(document.getElementById('big-clock')) document.getElementById('big-clock').innerText = t;
    if(alarmT === t.substring(0,5)) { alert("⏰ REMINDER!"); alarmT = null; }
}, 1000);