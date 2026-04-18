const affirmations = ["I am proud of how far I've come.", "Everything is falling into place.", "Ananya, you are doing great! ✨"];
const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    const randomIdx = Math.floor(Math.random() * affirmations.length);
    document.getElementById('affirmation-text').innerText = `"${affirmations[randomIdx]}"`;
    loadTasks();
    updateWaterUI();
    renderVisionBoard();
};

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// --- Task Logic ---
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

if(addBtn) {
    addBtn.onclick = () => {
        if (input.value.trim() !== "") {
            createTask(input.value);
            saveTasks();
            input.value = "";
        }
    };
}

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.style.cssText = "list-style:none; background:white; margin:8px 0; padding:10px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;";
    li.innerHTML = `<span style="${completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${text}</span><button onclick="this.parentElement.remove(); saveTasks();" style="border:none; background:none; cursor:pointer;">☁️</button>`;
    li.onclick = (e) => { if(e.target.tagName !== 'BUTTON') { 
        const s = li.querySelector('span');
        s.style.textDecoration = s.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        s.style.opacity = s.style.opacity === '0.5' ? '1' : '0.5';
        saveTasks();
    }};
    todoList.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span').forEach(s => tasks.push({text: s.innerText, completed: s.style.textDecoration === 'line-through'}));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks') || "[]");
    saved.forEach(t => createTask(t.text, t.completed));
}

// --- Timer ---
let timeLeft = 25 * 60, timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');

if(startBtn) {
    startBtn.onclick = () => {
        if (timerId) { clearInterval(timerId); timerId = null; startBtn.innerText = "Start"; }
        else { startBtn.innerText = "Pause"; timerId = setInterval(() => {
            timeLeft--;
            let mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
            timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft <= 0) { clearInterval(timerId); alert("Time for a break! 🌸"); }
        }, 1000); }
    };
}
document.getElementById('reset-timer').onclick = () => { clearInterval(timerId); timerId = null; timeLeft = 25 * 60; timerClock.innerText = "25:00"; startBtn.innerText = "Start"; };

// --- Water ---
let waterCount = localStorage.getItem('waterCount') || 0;
function addWater() { if (waterCount < 8) { waterCount++; updateWaterUI(); localStorage.setItem('waterCount', waterCount); } }
function resetWater() { waterCount = 0; updateWaterUI(); localStorage.setItem('waterCount', waterCount); }
function updateWaterUI() {
    if(document.getElementById('water-count')) document.getElementById('water-count').innerText = waterCount;
    const p = document.getElementById('plant-display');
    if(p) p.innerText = plants[Math.min(Math.floor(waterCount / 1.2), plants.length - 1)];
}

// --- Diary ---
function unlockDiary() {
    if (document.getElementById('diary-pin').value === "1234") {
        document.getElementById('diary-lock').style.display = 'none';
        document.getElementById('diary-open').style.display = 'block';
        document.getElementById('diary-input').value = localStorage.getItem('secretNote') || "";
    } else { alert("Wrong PIN! 🎀"); }
}
function saveDiary() { localStorage.setItem('secretNote', document.getElementById('diary-input').value); alert("Saved! ✨"); }

// --- Vision Board ---
function addImage() {
    const url = document.getElementById('vision-url').value.trim();
    if (url) {
        let v = JSON.parse(localStorage.getItem('visionImages') || "[]");
        v.push(url);
        localStorage.setItem('visionImages', JSON.stringify(v));
        renderVisionBoard();
        document.getElementById('vision-url').value = "";
    }
}
function renderVisionBoard() {
    const g = document.getElementById('vision-grid');
    if(!g) return;
    g.innerHTML = "";
    JSON.parse(localStorage.getItem('visionImages') || "[]").forEach(url => {
        const img = document.createElement('img'); img.src = url; img.className = 'vision-img';
        g.appendChild(img);
    });
}
function setMood(e) { alert(`Mood: ${e} ✨`); }