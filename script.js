const form = document.getElementById("task-form");
const dayInput = document.getElementById("day");
const timeInput = document.getElementById("time");
const activityInput = document.getElementById("activity");

const saveButton = document.getElementById("save-button");
const clearButton = document.getElementById("clear-button");
const pdfButton = document.getElementById("pdf-button");

const recurringToggle = document.getElementById("recurring-toggle");

const recurringOptions = document.getElementById("recurring-options");
const allDaysInput = document.getElementById("all-days");
const recurringDayInputs = document.querySelectorAll(".recurring-day");

recurringToggle.addEventListener("change", function () {
  recurringOptions.classList.toggle("visible", recurringToggle.checked);

  if (recurringToggle.checked === false) {
    clearRecurringSelection();
  }
});

allDaysInput.addEventListener("change", function () {
  for (const input of recurringDayInputs) {
    input.checked = allDaysInput.checked;
  }
});

for (const input of recurringDayInputs) {
  input.addEventListener("change", function () {
    updateAllDaysCheckbox();
  });
}

function updateAllDaysCheckbox() {
  const everyDayIsChecked = Array.from(recurringDayInputs).every(
    function (input) {
      return input.checked;
    },
  );

  allDaysInput.checked = everyDayIsChecked;
}

function clearRecurringSelection() {
  allDaysInput.checked = false;

  for (const input of recurringDayInputs) {
    input.checked = false;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const day = dayInput.value;
  const time = timeInput.value;
  const activity = activityInput.value;

  const selectedDays = getSelectedDays(day);

  for (const selectedDay of selectedDays) {
    createTask(selectedDay, time, activity);
  }

  form.reset();

  recurringOptions.classList.remove("visible");
  clearRecurringSelection();
});

function getSelectedDays(mainDay) {
  const selectedDays = [mainDay];

  for (const input of recurringDayInputs) {
    if (input.checked === true) {
      selectedDays.push(input.value);
    }
  }

  const uniqueDays = [...new Set(selectedDays)];

  return uniqueDays;
}

saveButton.addEventListener("click", function () {
  saveTasks();
  alert("Agenda salva com sucesso!");
});

clearButton.addEventListener("click", function () {
  const confirmClear = confirm("Tem certeza que deseja apagar toda a agenda?");

  if (confirmClear === false) {
    return;
  }

  clearAgenda();
});

pdfButton.addEventListener("click", function () {
  window.print();
});

function createTask(day, time, activity) {
  const dayCard = document.getElementById(day);
  const taskList = dayCard.querySelector("ul");

  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");

  taskItem.setAttribute("data-time", time);
  taskItem.setAttribute("data-day", day);
  taskItem.setAttribute("data-activity", activity);

  taskItem.innerHTML = `
    <div>
      <span class="task-time">${time}</span>
      <span>${activity}</span>
    </div>

    <button class="delete-button" type="button">x</button>
  `;

  const deleteButton = taskItem.querySelector(".delete-button");

  deleteButton.addEventListener("click", function () {
    taskItem.classList.add("removing");

    setTimeout(function () {
      taskItem.remove();
    }, 250);
  });

  addTaskInCorrectOrder(taskList, taskItem);
}

function addTaskInCorrectOrder(taskList, newTaskItem) {
  const tasks = taskList.querySelectorAll(".task-item");
  const newTaskTime = newTaskItem.getAttribute("data-time");

  for (const task of tasks) {
    const currentTaskTime = task.getAttribute("data-time");

    if (newTaskTime < currentTaskTime) {
      taskList.insertBefore(newTaskItem, task);
      return;
    }
  }

  taskList.appendChild(newTaskItem);
}

function saveTasks() {
  const tasks = document.querySelectorAll(".task-item");
  const tasksArray = [];

  for (const task of tasks) {
    const day = task.getAttribute("data-day");
    const time = task.getAttribute("data-time");
    const activity = task.getAttribute("data-activity");

    tasksArray.push({
      day: day,
      time: time,
      activity: activity,
    });
  }

  localStorage.setItem("weeklyTasks", JSON.stringify(tasksArray));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("weeklyTasks");

  if (savedTasks === null) {
    return;
  }

  const tasksArray = JSON.parse(savedTasks);

  for (const task of tasksArray) {
    createTask(task.day, task.time, task.activity);
  }
}

loadTasks();

function clearAgenda() {
  const tasks = document.querySelectorAll(".task-item");

  for (const task of tasks) {
    task.remove();
  }

  localStorage.removeItem("weeklyTasks");

  alert("Agenda apagada com sucesso!");
}

// Destacar card do dia  //
function highlightCurrentDay() {
  const today = new Date();
  const currentDayNumber = today.getDay();

  const daysOfWeek = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const currentDayName = daysOfWeek[currentDayNumber];
  const currentDayCard = document.getElementById(currentDayName);

  if (currentDayCard !== null) {
    currentDayCard.classList.add("current-day");
  }
}

highlightCurrentDay();
