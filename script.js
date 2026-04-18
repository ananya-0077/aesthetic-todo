const oracleAdvice = ["Ground yourself today. 🌿", "Slow resin cures lead to best results. 🎨", "Your hard work is blooming. 🎀", "A Taurus deserves a cozy break. 🧸"];

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    loadTasks();
    loadBigThree();
    renderVisionBoard();
    renderJar();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (tabId === 'vision-tab') renderVisionBoard();
    if (tabId === 'gratitude-tab') renderJar();
}

// VISION BOARD LOGIC
function addImage() {
    const url = document.getElementById('vision-url').value.trim();
    if (url) {
        let v = JSON.parse(localStorage.getItem('visionBoard')) || [];
        v.push(url);
        localStorage.setItem('visionBoard', JSON.stringify(v));
        renderVisionBoard();
        document.getElementById('vision-url').value = "";
    }
}
function renderVisionBoard() {
    const g = document.getElementById('vision-board-display');
    if (!g) return;
    g.innerHTML = "";
    const images = JSON.parse(localStorage.getItem('visionBoard')) || [];
    images.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        g.appendChild(img);
    });
}

// GRATITUDE JAR LOGIC
function addGratitude() {
    const input = document.getElementById('gratitude-input');
    if (input.value.trim()) {
        let jar = JSON.parse(localStorage.getItem('gratitudeJar')) || [];
        jar.push(input.value.trim());
        localStorage.setItem('gratitudeJar', JSON.stringify(jar));
        renderJar();
        input.value = "";
    }
}
function renderJar() {
    const jarContainer = document.getElementById('jar-notes-display');
    if (!jarContainer) return;
    jarContainer.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem('gratitudeJar')) || [];
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = "gratitude-note";
        div.innerText = note;
        jarContainer.appendChild(div);
    });
}

// TAURUS ORACLE
function flipCard() {
    const card = document.getElementById('oracle-card');
    card.innerText = oracleAdvice[Math.floor(Math.random() * oracleAdvice.length)];
    card.style.background = "white"; card.style.color = "#5d4037";
    setTimeout(() => { card.innerText = "Flip for Taurus Guidance 🔮"; card.style.background = ""; card.style.color = "white"; }, 5000);
}

// BIG THREE
function saveBigThree() {
    const data = { b1: document.getElementById('big1').value, b2: document.getElementById('big2').value, b3: document.getElementById('big3').value };
    localStorage.setItem('bigThree', JSON.stringify(data));
}
function loadBigThree() {
    const data = JSON.parse(localStorage.getItem('bigThree'));
    if(data) { document.getElementById('big1').value = data.b1; document.getElementById('big2').value = data.b2; document.getElementById('big3').value = data.b3; }
}

// Tasks & Other (Remains consistent with previous version)
function loadTasks() { JSON.parse(localStorage.getItem('tasks') || "[]").forEach(t => createTask(t.text, t.completed)); }
function createTask(text, completed = false) {
    const li = document.createElement('li'); li.innerHTML = `<span>${text}</span>`;
    li.onclick = () => { li.style.textDecoration = "line-through"; saveTasks(); };
    document.getElementById('todo-list').appendChild(li);
}
function saveTasks() {
    const tasks = []; document.querySelectorAll('#todo-list li').forEach(li => tasks.push({text: li.innerText, completed: li.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
document.getElementById('add-btn').onclick = () => { const t = document.getElementById('todo-input'); if(t.value) { createTask(t.value); saveTasks(); t.value = ""; } };