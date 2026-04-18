// --- Configuration & Data ---
const affirmations = [
    "I am proud of how far I've come.",
    "I am capable of amazing things.",
    "Everything is falling into place.",
    "Ananya, you are doing great! ✨",
    "Focus on the step, not the mountain. 🏔️"
];

const plants = ["🌱", "🌿", "🪴", "🍀", "🌳", "🌻", "🌈"];

// --- Initialization ---
window.onload = () => {
    // 1. Set Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, options);
    
    // 2. Set Random Affirmation
    const randomIdx = Math.floor(Math.random() * affirmations.length);
    document.getElementById('affirmation-text').innerText = `"${affirmations[randomIdx]}"`;
    
    // 3. Load Saved Data
    loadTasks();
    updateWaterUI();
    renderVisionBoard(); // <--- ADD THIS LINE HERE!
};

// --- Tab System ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    const selectedTab = document.getElementById(tabId);
    selectedTab.style.display = 'block';
    setTimeout(() => selectedTab.classList.add('active'), 10);
}

// --- To-Do List Logic ---
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

if(addBtn) {
    addBtn.addEventListener('click', () => {
        if (input.value.trim() !== "") {
            createTask(input.value);
            saveTasks();
            input.value = "";
        }
    });
}

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.style.cssText = "list-style:none; background:white; margin:10px 0; padding:12px; border-radius:15px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);";
    
    li.innerHTML = `
        <span class="task-text" style="${completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${text}</span> 
        <button onclick="this.parentElement.remove(); saveTasks();" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">☁️</button>
    `;

    li.querySelector('.task-text').onclick = function() {
        this.style.textDecoration = this.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        this.style.opacity = this.style.opacity === '0.5' ? '1' : '0.5';
        saveTasks();
    };

    todoList.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li span').forEach(s => {
        tasks.push({
            text: s.innerText,
            completed: s.style.textDecoration === 'line-through'
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('tasks') || "[]");
    saved.forEach(t => createTask(t.text, t.completed));
}

// --- Feature 1: Study Bunny Timer Logic ---
let timeLeft = 25 * 60;
let timerId = null;
const timerClock = document.getElementById('timer-clock');
const startBtn = document.getElementById('start-timer');

if(startBtn) {
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
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    alert("Study session complete! Take a break. 🌸");
                }
            }, 1000);
        }
    });
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    timerClock.innerText = "25:00";
    startBtn.innerText = "Start";
}
// Connecting the reset button manually just in case
const resetBtn = document.getElementById('reset-timer');
if(resetBtn) resetBtn.onclick = resetTimer;


// --- Feature 2: Water Tracker Logic ---
let waterCount = localStorage.getItem('waterCount') || 0;

function addWater() {
    if (waterCount < 8) {
        waterCount++;
        updateWaterUI();
        saveWater();
    } else {
        alert("You're fully hydrated! Great job, Ananya. 🌻");
    }
}

function resetWater() {
    waterCount = 0;
    updateWaterUI();
    saveWater();
}

function updateWaterUI() {
    const countSpan = document.getElementById('water-count');
    const plantDisplay = document.getElementById('plant-display');
    
    if(countSpan) countSpan.innerText = waterCount;
    
    if(plantDisplay) {
        // Calculate which emoji to show based on count
        const plantIdx = Math.min(Math.floor(waterCount / 1.2), plants.length - 1);
        plantDisplay.innerText = plants[plantIdx];
        
        // Add the grow animation
        plantDisplay.classList.add('grow-anim');
        setTimeout(() => plantDisplay.classList.remove('grow-anim'), 300);
    }
}

function saveWater() {
    localStorage.setItem('waterCount', waterCount);
}

// Mood function for Dashboard
function setMood(emoji) {
    localStorage.setItem('userMood', emoji);
    alert(`Feeling ${emoji} today. Sending you good vibes! ✨`);
}

// Support for 'Enter' key on input
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// --- Feature 3: Secret Diary Logic ---
function unlockDiary() {
    const enteredPin = document.getElementById('diary-pin').value;
    const correctPin = "1234"; // Your secret code
    
    console.log("Unlock attempt with:", enteredPin); // This helps us debug!

    if (enteredPin === correctPin) {
        document.getElementById('diary-lock').style.display = 'none';
        document.getElementById('diary-open').style.display = 'block';
        
        // Load the saved note
        const savedNote = localStorage.getItem('secretNote');
        if (savedNote) {
            document.getElementById('diary-input').value = savedNote;
        }
    } else {
        alert("Oops! Wrong PIN. 🎀");
        document.getElementById('diary-pin').value = ""; // Clear the wrong PIN
    }
}

function saveDiary() {
    const note = document.getElementById('diary-input').value;
    localStorage.setItem('secretNote', note);
    alert("Note saved safely! ✨");
}

function lockDiary() {
    document.getElementById('diary-lock').style.display = 'block';
    document.getElementById('diary-open').style.display = 'none';
    document.getElementById('diary-pin').value = ""; // Clear PIN for safety
}
// --- Feature 4: Vision Board Logic ---
function addImage() {
    const urlInput = document.getElementById('vision-url');
    const url = urlInput.value.trim();
    
    if (url !== "") {
        let visionImages = JSON.parse(localStorage.getItem('visionImages') || "[]");
        visionImages.push(url);
        localStorage.setItem('visionImages', JSON.stringify(visionImages));
        renderVisionBoard();
        urlInput.value = "";
    }
}

function renderVisionBoard() {
    const grid = document.getElementById('vision-grid');
    const images = JSON.parse(localStorage.getItem('visionImages') || "[]");
    
    grid.innerHTML = "";
    images.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'vision-img';
        img.onclick = () => removeImage(index); // Option to delete
        grid.appendChild(img);
    });
}

function removeImage(index) {
    if(confirm("Remove this image from your vision board?")) {
        let visionImages = JSON.parse(localStorage.getItem('visionImages') || "[]");
        visionImages.splice(index, 1);
        localStorage.setItem('visionImages', JSON.stringify(visionImages));
        renderVisionBoard();
    }
}

// Don't forget to add renderVisionBoard(); inside your window.onload function!