const oracleAdvice = ["Ground yourself today. 🌿", "Slow resin cures lead to best results. 🎨", "Your hard work is blooming. 🎀", "A Taurus deserves a cozy break. 🧸"];

let goals = JSON.parse(localStorage.getItem('userGoals')) || { steps: 10000, water: 8 };
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
let orders = JSON.parse(localStorage.getItem('resinOrders')) || [];

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    loadTasks();
    loadBigThree();
    renderVisionBoard();
    renderJar();
    renderOrders();
    updateWaterUI();
    updateFitnessUI();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    window.scrollTo(0, 0);
    const h = document.getElementById('main-header'), d = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') { h.style.display = 'block'; d.style.display = 'block'; checkBadges(); }
    else { h.style.display = 'none'; d.style.display = 'none'; }
}

// CORE LOGIC
function flipCard() {
    const card = document.getElementById('oracle-card');
    card.innerText = oracleAdvice[Math.floor(Math.random() * oracleAdvice.length)];
    card.style.background = "white"; card.style.color = "#5d4037";
    setTimeout(() => { card.innerText = "Flip for Taurus Guidance 🔮"; card.style.background = ""; card.style.color = "white"; }, 5000);
}

function saveBigThree() {
    const data = { b1: document.getElementById('big1').value, b2: document.getElementById('big2').value, b3: document.getElementById('big3').value };
    localStorage.setItem('bigThree', JSON.stringify(data));
}
function loadBigThree() {
    const data = JSON.parse(localStorage.getItem('bigThree'));
    if(data) { document.getElementById('big1').value = data.b1; document.getElementById('big2').value = data.b2; document.getElementById('big3').value = data.b3; }
}

// VISION & JAR
function addImage() {
    const url = document.getElementById('vision-url').value.trim();
    if (url) {
        let v = JSON.parse(localStorage.getItem('visionBoard')) || [];
        v.push(url); localStorage.setItem('visionBoard', JSON.stringify(v));
        renderVisionBoard(); document.getElementById('vision-url').value = "";
    }
}
function renderVisionBoard() {
    const g = document.getElementById('vision-board-display'); if (!g) return;
    g.innerHTML = "";
    const images = JSON.parse(localStorage.getItem('visionBoard')) || [];
    images.forEach(url => { const img = document.createElement('img'); img.src = url; g.appendChild(img); });
}

function addGratitude() {
    const input = document.getElementById('gratitude-input');
    if (input.value.trim()) {
        let jar = JSON.parse(localStorage.getItem('gratitudeJar')) || [];
        jar.push(input.value.trim()); localStorage.setItem('gratitudeJar', JSON.stringify(jar));
        renderJar(); input.value = "";
    }
}
function renderJar() {
    const jar = document.getElementById('jar-notes-display'); if (!jar) return;
    jar.innerHTML = (JSON.parse(localStorage.getItem('gratitudeJar')) || []).map(n => `<div class="gratitude-note">${n}</div>`).join('');
}

// STUDIO
function addOrder() {
    const name = document.getElementById('order-name').value, item = document.getElementById('order-item').value;
    if(name && item) { orders.push({ name, item, status: "Curing" }); localStorage.setItem('resinOrders', JSON.stringify(orders)); renderOrders(); }
}
function renderOrders() {
    const list = document.getElementById('order-list'); if(!list) return;
    list.innerHTML = orders.map((o, i) => `<li class="order-item"><div><strong>${o.name}</strong><br><small>${o.item}</small></div><div class="status-tag" onclick="toggleStatus(${i})">${o.status}</div></li>`).join('');
}
function toggleStatus(i) {
    const s = ["Curing", "Polished", "Shipped"]; orders[i].status = s[(s.indexOf(orders[i].status) + 1) % s.length];
    localStorage.setItem('resinOrders', JSON.stringify(orders)); renderOrders();
}

// TASKS & BADGES
function checkBadges() {
    const row = document.getElementById('badge-display'); if(!row) return; row.innerHTML = "";
    const badgeList = [{ i: '🏆', c: steps >= goals.steps }, { i: '💎', c: waterCount >= goals.water }, { i: '🎀', c: document.querySelectorAll('#todo-list li span[style*="line-through"]').length >= 3 }];
    badgeList.forEach(b => { const span = document.createElement('span'); span.innerText = b.i; span.className = `badge-icon ${b.c ? 'badge-unlocked' : ''}`; row.appendChild(span); });
}
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }
function createTask(text, completed = false) {
    const li = document.createElement('li'); li.innerHTML = `<span>${text}</span>`;
    if(completed) li.style.textDecoration = "line-through";
    li.onclick = () => { li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through'; saveTasks(); checkBadges(); };
    document.getElementById('todo-list').appendChild(li);
}
function saveTasks() {
    const tasks = []; document.querySelectorAll('#todo-list li').forEach(li => tasks.push({text: li.innerText, completed: li.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
document.getElementById('add-btn').onclick = () => { const t = document.getElementById('todo-input'); if(t.value) { createTask(t.value); saveTasks(); t.value = ""; } };

// WELLNESS UPDATES
function updateWaterUI() { if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount; checkBadges(); }
function addWater() { waterCount++; localStorage.setItem('waterCount', waterCount); updateWaterUI(); }
function updateFitnessUI() { if(document.getElementById('current-steps')) document.getElementById('current-steps').innerText = steps.toLocaleString(); const bar = document.getElementById('step-progress'); if(bar) bar.style.width = Math.min((steps / goals.steps) * 100, 100) + "%"; checkBadges(); }
function addSteps() { steps += 1000; localStorage.setItem('userSteps', steps); updateFitnessUI(); }
function saveSleep() { localStorage.setItem('sleep', document.getElementById('dream-input').value); alert("Dream Logged! ☁️"); }