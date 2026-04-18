const oracleAdvice = ["Focus on your grounding today. 🌿", "Slow resin cures lead to best results. 🎨", "Your hard work is blooming. 🎀", "A Taurus deserves a cozy break. 🧸"];
let orders = JSON.parse(localStorage.getItem('resinOrders')) || [];
let gratitudeJar = JSON.parse(localStorage.getItem('gratitude')) || [];

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    loadTasks();
    loadBigThree();
    renderJar();
    renderOrders();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// TAURUS ORACLE
function flipCard() {
    const card = document.getElementById('oracle-card');
    card.innerText = oracleAdvice[Math.floor(Math.random() * oracleAdvice.length)];
    card.style.background = "white"; card.style.color = "#5d4037";
    setTimeout(() => { card.innerText = "Flip for Taurus Guidance 🔮"; card.style.background = ""; card.style.color = "white"; }, 5000);
}

// BIG 3
function saveBigThree() {
    const data = { b1: document.getElementById('big1').value, b2: document.getElementById('big2').value, b3: document.getElementById('big3').value };
    localStorage.setItem('bigThree', JSON.stringify(data));
}
function loadBigThree() {
    const data = JSON.parse(localStorage.getItem('bigThree'));
    if(data) { document.getElementById('big1').value = data.b1; document.getElementById('big2').value = data.b2; document.getElementById('big3').value = data.b3; }
}

// GRATITUDE JAR
function addGratitude() {
    const input = document.getElementById('gratitude-input');
    if(input.value) { gratitudeJar.push(input.value); localStorage.setItem('gratitude', JSON.stringify(gratitudeJar)); renderJar(); input.value = ""; }
}
function renderJar() {
    const jar = document.getElementById('jar-notes'); if(!jar) return;
    jar.innerHTML = gratitudeJar.map(n => `<div class="gratitude-note">${n}</div>`).join('');
}

// RESIN ORDERS
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

// TASKS
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }
function createTask(text, completed = false) {
    const li = document.createElement('li'); li.innerHTML = `<span>${text}</span>`;
    li.onclick = () => { li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through'; saveTasks(); };
    document.getElementById('todo-list').appendChild(li);
}
function saveTasks() {
    const tasks = []; document.querySelectorAll('#todo-list li').forEach(li => tasks.push({text: li.innerText, completed: li.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
document.getElementById('add-btn').onclick = () => { const t = document.getElementById('todo-input'); if(t.value) { createTask(t.value); saveTasks(); t.value = ""; } };