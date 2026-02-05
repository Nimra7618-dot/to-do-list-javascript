let tasksDiv = document.getElementById("tasks");
let currentTaskDiv = null;

// ------------------- INDEX.HTML -------------------
// On page load
window.addEventListener("DOMContentLoaded", function () {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Clear all dynamically added tasks first (except hard-coded)
    let dynamicDivs = Array.from(tasksDiv.querySelectorAll(".task-box")).slice(savedTasks.length);
    dynamicDivs.forEach(div => div.remove());

    // Update hard-coded divs with saved tasks if any
    let hardcodedDivs = tasksDiv.querySelectorAll(".task-box h3");
    hardcodedDivs.forEach((h3, i) => {
        if (savedTasks[i]) h3.innerText = savedTasks[i];
        // Make sure checkboxes are unchecked on load
        let checkbox = h3.closest(".task-box").querySelector("input[type=checkbox]");
        if (checkbox) checkbox.checked = false;
    });

    // Add any extra dynamic tasks from localStorage
    for (let i = hardcodedDivs.length; i < savedTasks.length; i++) {
        createTaskDiv(savedTasks[i], false);
    }

    // Completed tasks section should be empty on load
    let completedDiv = document.getElementById("completed");
    if (completedDiv) completedDiv.innerHTML = "";
});
// completed.html JavaScript
window.addEventListener("DOMContentLoaded", function () {
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    let taskList = document.getElementById("tasklisted");

    taskList.innerHTML = ""; // clear previous content

    completedTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerText = "✔ " + task;
        li.style.fontWeight = "bold";
        li.style.color = "black";
        taskList.appendChild(li);
    });
});

// Show Add Task inputs
document.getElementById("button1")?.addEventListener("click", () => {
    document.getElementById("label1").style.display = "block";
    document.getElementById("placehold1").style.display = "block";
    document.getElementById("submit").style.display = "block";
});
// ------------------- INDEX.HTML -------------------
// On page load
window.addEventListener("DOMContentLoaded", function () {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    // Clear dynamic tasks first (except hard-coded)
    let dynamicDivs = Array.from(tasksDiv.querySelectorAll(".task-box")).slice(savedTasks.length);
    dynamicDivs.forEach(div => div.remove());

    // Update hard-coded divs
    let hardcodedDivs = tasksDiv.querySelectorAll(".task-box h3");
    hardcodedDivs.forEach((h3, i) => {
        if (savedTasks[i]) h3.innerText = savedTasks[i];
        let checkbox = h3.closest(".task-box").querySelector("input[type=checkbox]");
        if (checkbox) {
            // Mark checkbox if task is completed
            checkbox.checked = completedTasks.includes(h3.innerText);
        }
    });

    // Add dynamic tasks
    for (let i = hardcodedDivs.length; i < savedTasks.length; i++) {
        createTaskDiv(savedTasks[i], completedTasks.includes(savedTasks[i]));
    }

    // Fill Completed Tasks section
    completedTasks.forEach(task => addToCompletedSection(task));
});

// ------------------- Completed Tasks Functions -------------------
function moveTask(box) {
    let taskDiv = box.closest(".task-box");
    let taskName = taskDiv.querySelector("h3").innerText;

    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    if (box.checked) {
        // Add to completed
        if (!completedTasks.includes(taskName)) {
            completedTasks.push(taskName);
            addToCompletedSection(taskName);
        }
    } else {
        // Remove from completed
        completedTasks = completedTasks.filter(t => t !== taskName);
        removeFromCompletedSection(taskName);
    }

    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function addToCompletedSection(taskName) {
    let completedDiv = document.getElementById("completed");
    if (!completedDiv) return;

    // Avoid duplicates
    let exists = Array.from(completedDiv.getElementsByTagName("p"))
        .some(p => p.innerText.includes(taskName));
    if (exists) return;

    let p = document.createElement("p");
    p.innerText = "✔ " + taskName;
    p.style.color = "black";
    p.style.fontWeight = "bold";
    completedDiv.appendChild(p);

    let emoji = document.createElement("span");
    emoji.className = "emoji-pop";
    emoji.innerText = "🥳";
    completedDiv.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
}

function removeFromCompletedSection(taskName) {
    let completedDiv = document.getElementById("completed");
    if (!completedDiv) return;

    let ps = completedDiv.getElementsByTagName("p");
    for (let p of ps) {
        if (p.innerText.includes(taskName)) {
            p.remove();
            break;
        }
    }
}

// Add new task
document.getElementById("submit")?.addEventListener("click", function (e) {
    e.preventDefault(); // prevent page reload

    let taskInput = document.getElementById("placehold1");
    let task = taskInput.value.trim();

    if (!task) {
        alert("Please enter task");
        return;
    }

    // Get existing tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Check if task already exists
    if (tasks.includes(task)) {
        alert("This task already exists!");
        taskInput.focus(); // focus input to fix
        return;
    }

    // Save task in localStorage
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Show success alert first
    alert("Task entered successfully");
    window.location.href = "index.html"; 
    // After alert, add task to the task list
    createTaskDiv(task, false);

    // Clear input
    taskInput.value = "";
// Scroll to the newly added task
    let allTasks = document.querySelectorAll(".task-box");
    let lastTask = allTasks[allTasks.length - 1];
    lastTask.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ------------------- Functions -------------------

// Function to create a task div dynamically
function createTaskDiv(taskName, isCompleted) {
    let newDiv = document.createElement("div");
    newDiv.className = "task-box";
    newDiv.innerHTML = `
        <h3>${taskName}</h3>
        <br>
        <div id="conatiner1">
            <input type="checkbox" ${isCompleted ? "checked" : ""} onclick="moveTask(this)">
            <label>Mark Completed</label>
        </div>
        <br><br>
        <div class="button-group">
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
        </div>
    `;
    tasksDiv.appendChild(newDiv);

    if (isCompleted) addToCompletedSection(taskName);
}

function moveTask(box) {
    let taskDiv = box.closest(".task-box");
    let taskName = taskDiv.querySelector("h3").innerText;

    // Get completed tasks from localStorage
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    if (box.checked) {
        // Add task if not already in completed
        if (!completedTasks.includes(taskName)) {
            completedTasks.push(taskName);
            addToCompletedSection(taskName); // add to completed section
        }
    } else {
        // Remove task from completed
        completedTasks = completedTasks.filter(t => t !== taskName);
        removeFromCompletedSection(taskName);
    }

    // Save updated completed tasks
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function addToCompletedSection(taskName) {
    let completedDiv = document.getElementById("completed");
    if (!completedDiv) return;

    // Check if task already exists in completed section
    let exists = Array.from(completedDiv.getElementsByTagName("p"))
        .some(p => p.innerText.includes(taskName));
    if (exists) return;

    let p = document.createElement("p");
    p.innerText = "✔ " + taskName;
    p.style.color = "black";
    p.style.fontWeight = "bold";
    completedDiv.appendChild(p);

    // Optional: small emoji effect
    let emoji = document.createElement("span");
    emoji.className = "emoji-pop";
    emoji.innerText = "🥳";
    completedDiv.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
}

function removeFromCompletedSection(taskName) {
    let completedDiv = document.getElementById("completed");
    if (!completedDiv) return;

    let ps = completedDiv.getElementsByTagName("p");
    for (let p of ps) {
        if (p.innerText.includes(taskName)) {
            p.remove();
            break;
        }
    }
}

// Edit task
function editTask(btn) {
    currentTaskDiv = btn.closest(".task-box");
    let taskName = currentTaskDiv.querySelector("h3").innerText;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let index = tasks.indexOf(taskName);

    localStorage.setItem("editTaskName", taskName);
    localStorage.setItem("editTaskIndex", index);
    window.location.href = "edit.html";
}

// Delete task
function deleteTask(btn) {
    if (!confirm("Do you want to delete this task?")) return;

    let taskDiv = btn.closest(".task-box");
    let taskName = taskDiv.querySelector("h3").innerText;
    taskDiv.remove();

    // Remove from tasks and completedTasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t !== taskName);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    completedTasks = completedTasks.filter(t => t !== taskName);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    removeFromCompletedSection(taskName);
}

// ------------------- EDIT.HTML -------------------
function loadEditInput() {
    let oldTask = localStorage.getItem("editTaskName");
    if (oldTask) {
        let input = document.getElementById("editInput");
        if (input) input.value = oldTask;
    }
}

function saveEditedTask() {
    let newValue = document.getElementById("editInput")?.value.trim();
    if (!newValue) return alert("Please enter valid task");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    let index = parseInt(localStorage.getItem("editTaskIndex"));

    if (index !== -1) {
        let oldTask = tasks[index];

        // Update task name
        tasks[index] = newValue;
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Update completed tasks if needed
        if (completedTasks.includes(oldTask)) {
            completedTasks = completedTasks.map(t => t === oldTask ? newValue : t);
            localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        }
    }

    localStorage.removeItem("editTaskName");
    localStorage.removeItem("editTaskIndex");

    window.location.href = "index.html";
}
