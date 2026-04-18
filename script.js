let water = parseInt(localStorage.getItem('w_val')) || 0;
let jar = JSON.parse(localStorage.getItem('j_val')) || [];
let ece = JSON.parse(localStorage.getItem('e_val')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'});

    // NAVIGATION
    document.querySelectorAll('.feature-item').forEach(item => {
        item.onclick = () => {
            const tabId = item.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
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

    // WATER
    document.getElementById('w-add').onclick = () => { 
        water++; save('w_val', water); updateUI(); 
        if(water == document.getElementById('w-goal').value) showToast("💎 Water Goal Reached!");
    };
    document.getElementById('w-reset').onclick = () => { water = 0; save('w_val', 0); updateUI(); };

    // JAR
    document.getElementById('j-add').onclick = () => {
        const val = document.getElementById('j-in').value;
        if(val) { jar.push(val); save('j_val', jar); renderJar(); document.getElementById('j-in').value = ""; }
    };

    // MOOD
    document.querySelectorAll('.m-opt').forEach(btn => {
        btn.onclick = () => {
            const color = btn.getAttribute('data-color');
            document.body.style.background = `linear-gradient(135deg, ${color} 0%, #e1f5fe 100%)`;
            document.getElementById('m-status').innerText = "Vibe updated! ✨";
            showToast("Mood Updated!");
        };
    });

    // DIARY
    document.getElementById('d-unlock').onclick = () => {
        if(document.getElementById('d-pin').value === "1234") {
            document.getElementById('d-lock').style.display = 'none';
            document.getElementById('d-open').style.display = 'block';
            document.getElementById('d-area').value = localStorage.getItem('d_text') || "";
        } else alert("Wrong PIN!");
    };
    document.getElementById('d-save').onclick = () => { localStorage.setItem('d_text', document.getElementById('d-area').value); showToast("🔒 Secret Saved!"); };

    // DEGREE
    document.getElementById('deg-add').onclick = () => {
        const val = document.getElementById('deg-in').value;
        if(val) { ece.push({n: val, d: false}); save('e_val', ece); renderECE(); document.getElementById('deg-in').value = ""; }
    };

    renderJar(); renderECE();
});

function updateUI() { document.getElementById('w-now').innerText = water; }
function renderJar() { document.getElementById('j-list').innerHTML = jar.map(n => `<div class="gratitude-note">${n}</div>`).join(''); }
function renderECE() {
    const list = document.getElementById('deg-list');
    if(!list) return;
    const done = ece.filter(s => s.d).length;
    list.innerHTML = ece.map((s, i) => `<li style="background:white; padding:10px; border-radius:10px; list-style:none; margin:5px; cursor:pointer; opacity:${s.d?0.5:1}" onclick="toggleECE(${i})">${s.n} ${s.d?'✅':'⏳'}</li>`).join('');
    document.getElementById('deg-bar').style.width = ece.length ? (done/ece.length)*100 + "%" : "0%";
}
window.toggleECE = (i) => { ece[i].d = !ece[i].d; save('e_val', ece); renderECE(); };
function save(k, v) { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : v); }
function showToast(m) { 
    const t = document.createElement('div'); t.className='toast'; t.innerText=m; 
    document.getElementById('toast-container').appendChild(t); setTimeout(()=>t.remove(), 2500); 
}

setInterval(() => {
    document.getElementById('mini-clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false});
}, 1000);