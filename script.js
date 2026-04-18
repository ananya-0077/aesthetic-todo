const affirmations = ["Ananya, you are doing great! ✨", "Focus on the step, not the mountain. 🏔️", "Everything is falling into place. 🎀"];
const oracleAdvice = ["Ground yourself today. Touch grass. 🌿", "Slow and steady wins the race. 🎨", "Your hard work deserves a reward. 🧸"];

let goals = JSON.parse(localStorage.getItem('userGoals')) || { steps: 10000, water: 8 };
let steps = parseInt(localStorage.getItem('userSteps')) || 0;
let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
let orders = JSON.parse(localStorage.getItem('resinOrders')) || [];

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    document.getElementById('affirmation-text').innerText = affirmations[Math.floor(Math.random() * affirmations.length)];
    loadTasks();
    updateWaterUI();
    updateFitnessUI();
    renderOrders();
    checkBadges();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const h = document.getElementById('main-header'), d = document.getElementById('dashboard-content');
    if (tabId === 'dashboard') { h.style.display = 'block'; d.style.display = 'block'; checkBadges(); }
    else { h.style.display = 'none'; d.style.display = 'none'; }
}

// TAURUS ORACLE
function flipCard() {
    const card = document.getElementById('oracle-card');
    card.classList.add('flipped');
    card.innerText = oracleAdvice[Math.floor(Math.random() * oracleAdvice.length)];
    setTimeout(() => { card.classList.remove('flipped'); card.innerText = "Flip for Guidance 🔮"; }, 5000);
}

// RESIN ORDERS
function addOrder() {
    const name = document.getElementById('order-name').value;
    const item = document.getElementById('order-item').value;
    if(name && item) {
        orders.push({ name, item, status: "Curing" });
        localStorage.setItem('resinOrders', JSON.stringify(orders));
        renderOrders();
        document.getElementById('order-name').value = ""; document.getElementById('order-item').value = "";
    }
}

function renderOrders() {
    const list = document.getElementById('order-list');
    if(!list) return;
    list.innerHTML = "";
    orders.forEach((o, i) => {
        const li = document.createElement('li');
        li.className = "order-item";
        li.innerHTML = `<div><strong>${o.name}</strong><br><small>${o.item}</small></div><div class="status-tag" onclick="toggleStatus(${i})">${o.status}</div>`;
        list.appendChild(li);
    });
}

function toggleStatus(i) {
    const s = ["Curing", "Polished", "Shipped"];
    orders[i].status = s[(s.indexOf(orders[i].status) + 1) % s.length];
    localStorage.setItem('resinOrders', JSON.stringify(orders));
    renderOrders();
}

// BADGES & CORE WELLNESS
function checkBadges() {
    const row = document.getElementById('badge-display'); if(!row) return;
    row.innerHTML = "";
    const badgeList = [{ i: '🏆', c: steps >= goals.steps }, { i: '💎', c: waterCount >= goals.water }, { i: '🎀', c: document.querySelectorAll('#todo-list li span[style*="line-through"]').length >= 3 }];
    badgeList.forEach(b => {
        const span = document.createElement('span'); span.innerText = b.i;
        span.className = `badge-icon ${b.c ? 'badge-unlocked' : ''}`;
        row.appendChild(span);
    });
}

function updateStepGoal() { goals.steps = parseInt(document.getElementById('step-goal-input').value) || 10000; localStorage.setItem('userGoals', JSON.stringify(goals)); updateFitnessUI(); }
function addSteps() { const val = parseInt(document.getElementById('step-input').value); if (val > 0) { steps += val; localStorage.setItem('userSteps', steps); updateFitnessUI(); document.getElementById('step-input').value = ""; } }
function resetSteps() { steps = 0; localStorage.setItem('userSteps', 0); updateFitnessUI(); }
function updateFitnessUI() {
    if(document.getElementById('current-steps')) document.getElementById('current-steps').innerText = steps.toLocaleString();
    if(document.getElementById('step-goal-input')) document.getElementById('step-goal-input').value = goals.steps;
    const bar = document.getElementById('step-progress');
    if(bar) bar.style.width = Math.min((steps / goals.steps) * 100, 100) + "%";
    checkBadges();
}

function updateWaterGoal() { goals.water = parseInt(document.getElementById('water-goal-input').value) || 8; localStorage.setItem('userGoals', JSON.stringify(goals)); updateWaterUI(); }
function addWater() { waterCount++; localStorage.setItem('waterCount', waterCount); updateWaterUI(); }
function resetWater() { waterCount = 0; localStorage.setItem('waterCount', 0); updateWaterUI(); }
function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    if(document.getElementById('water-goal-input')) document.getElementById('water-goal-input').value = goals.water;
    checkBadges();
}

// Tasks
function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `<span style="${completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${text}</span><span>✨</span>`;
    li.onclick = () => { const s = li.querySelector('span'); s.style.textDecoration = s.style.textDecoration === 'line-through' ? 'none' : 'line-through'; saveTasks(); checkBadges(); };
    document.getElementById('todo-list').appendChild(li);
}
function saveTasks() { const tasks = []; document.querySelectorAll('#todo-list li span:first-child').forEach(s => tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'})); localStorage.setItem('tasks', JSON.stringify(tasks)); }
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }
document.getElementById('add-btn').onclick = () => { const t = document.getElementById('todo-input'); if(t.value) { createTask(t.value); saveTasks(); t.value = ""; } };