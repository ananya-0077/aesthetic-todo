// --- Initial Setup ---
const affirmations = [
    "I am proud of how far I've come.",
    "I am capable of amazing things.",
    "Everything is falling into place.",
    "Ananya, you are doing great! ✨"
];

window.onload = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    
    const randomIdx = Math.floor(Math.random() * affirmations.length);
    document.getElementById('affirmation-text').innerText = `"${affirmations[randomIdx]}"`;
    
    loadTasks();
};

// --- Tab System ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// --- To-Do Logic ---
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
    if (input.value.trim() !== "") {
        createTask(input.value);
        saveTasks();
        input.value = "";
    }
});

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.style.cssText = "list-style:none; background:white; margin:10px 0; padding:10px; border-radius:10px; display:flex; justify-content:space-between;";
    li.innerHTML = `<span>${text}</span> <button onclick="this.parentElement.remove(); saveTasks();" style="border:none; background:none; cursor:pointer;">☁️</button>`;
    todoList.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span').forEach(s => tasks.push(s.innerText));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks') || "[]");
    saved.forEach(t => createTask(t));
}

// --- Feature 1: Study Bunny Logic ---
let timeLeft = 25 * 60;
let timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');

startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.innerText = "Start";
    } else {
        startBtn.innerText = "Pause";
        timerId = setInterval(() => {
            timeLeft--;
            let mins = Math.floor(timeLeft / 60);
            let secs = timeLeft % 60;
            timerClock.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft <= 0) clearInterval(timerId);
        }, 1000);
    }
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    timerClock.innerText = "25:00";
    startBtn.innerText = "Start";
});