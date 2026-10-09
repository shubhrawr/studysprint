
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(
  localStorage.getItem("studysprintTasks")
) || [];

let currentFilter = "all";

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "pending") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  visibleTasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = " " + task.name + " ";

    if (task.completed) {
      span.style.textDecoration = "line-through";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      renderTasks();
    });

    li.append(checkbox, span, deleteBtn);
    taskList.appendChild(li);
  });

  const completedCount = tasks.filter(
    task => task.completed
  ).length;

  progressText.textContent =
    `${completedCount} of ${tasks.length} tasks completed`;

  localStorage.setItem(
    "studysprintTasks",
    JSON.stringify(tasks)
  );
}


function addTask() {
  const taskName = taskInput.value.trim();

  if (taskName === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    id: Date.now(),
    name: taskName,
    completed: false
  };

  tasks.push(task);
  taskInput.value = "";

  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();
