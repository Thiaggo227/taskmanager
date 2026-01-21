/* ================= MENU ================= */
const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menu");

menuIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("active");
  menuIcon.classList.toggle("bi-x");
  menuIcon.classList.toggle("bi-list");
});

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("active");
    menuIcon.classList.replace("bi-x", "bi-list");
  }
});

/* ================= TO DO LIST (LOCAL STORAGE) ================= */
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((text, index) => {
    const task = document.createElement("div");
    task.className = "box";
    task.innerHTML = `
      <div class="input-group">
        <i class="bi bi-check-circle-fill" style="color:#28a745"></i>
        <span>${text}</span>
        <button class="btnApagar"><i class="bi bi-trash-fill"></i></button>
      </div>
    `;

    task.querySelector(".btnApagar").onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    taskList.appendChild(task);
  });
}

function addTask() {
  const text = todoInput.value.trim();
  if (!text) return;

  tasks.push(text);
  saveTasks();
  renderTasks();
  todoInput.value = "";
}

addBtn.onclick = addTask;
todoInput.addEventListener("keypress", (e) => e.key === "Enter" && addTask());

renderTasks();

/* ================= FINANÇAS (LOCAL STORAGE) ================= */
let finance = JSON.parse(localStorage.getItem("finance")) || {
  entry: 0,
  exit: 0,
};

function saveFinance() {
  localStorage.setItem("finance", JSON.stringify(finance));
}

function updateFinance() {
  document.getElementById("entry").innerText = finance.entry.toFixed(2);
  document.getElementById("exit").innerText = finance.exit.toFixed(2);
  document.getElementById("balance").innerText =
    (finance.entry - finance.exit).toFixed(2);
  document.getElementById("value").value = "";
}

function addEntry() {
  const v = +document.getElementById("value").value;
  if (v > 0) {
    finance.entry += v;
    saveFinance();
    updateFinance();
  }
}

function addExit() {
  const v = +document.getElementById("value").value;
  if (v > 0) {
    finance.exit += v;
    saveFinance();
    updateFinance();
  }
}

function resetValues() {
  finance = { entry: 0, exit: 0 };
  saveFinance();
  updateFinance();
}

updateFinance();

/* ================= CALENDÁRIO ================= */
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let events = JSON.parse(localStorage.getItem("events")) || {};
let currentDate = new Date();

/* ===== MODAL ADICIONAR ===== */
const addEventModal = document.getElementById("addEventModal");
const eventInput = document.getElementById("eventInput");
const confirmAddEvent = document.getElementById("confirmAddEvent");
const cancelAddEvent = document.getElementById("cancelAddEvent");

let selectedDate = null;

function openAddEventModal(date) {
  selectedDate = date;
  eventInput.value = "";
  addEventModal.classList.add("active");
  setTimeout(() => eventInput.focus(), 100);
}

function closeAddEventModal() {
  addEventModal.classList.remove("active");
  selectedDate = null;
}

confirmAddEvent.onclick = () => {
  const text = eventInput.value.trim();
  if (!text || !selectedDate) return;

  if (!events[selectedDate]) events[selectedDate] = [];
  events[selectedDate].push(text);

  localStorage.setItem("events", JSON.stringify(events));
  closeAddEventModal();
  renderCalendar();
};

cancelAddEvent.onclick = closeAddEventModal;

/* ===== MODAL APAGAR ===== */
const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

let deleteAction = null;

function openDeleteModal(action) {
  deleteAction = action;
  deleteModal.classList.add("active");
}

function closeDeleteModal() {
  deleteModal.classList.remove("active");
  deleteAction = null;
}

confirmDelete.onclick = () => {
  if (deleteAction) deleteAction();
  closeDeleteModal();
};

cancelDelete.onclick = closeDeleteModal;

/* ===== RENDER CALENDÁRIO ===== */
function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.innerText = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${year}-${month + 1}-${d}`;
    const dayDiv = document.createElement("div");
    dayDiv.innerHTML = `<strong>${d}</strong>`;

    if (events[dateKey]?.length) {
      dayDiv.classList.add("day-has-event");
    }

    if (events[dateKey]) {
      events[dateKey].forEach((ev, i) => {
        const evDiv = document.createElement("div");
        evDiv.className = "event";
        evDiv.innerHTML = `<span>${ev}</span><i class="bi bi-trash-fill"></i>`;

        evDiv.querySelector("i").onclick = (e) => {
          e.stopPropagation();
          openDeleteModal(() => {
            events[dateKey].splice(i, 1);
            if (!events[dateKey].length) delete events[dateKey];
            localStorage.setItem("events", JSON.stringify(events));
            renderCalendar();
          });
        };

        dayDiv.appendChild(evDiv);
      });
    }

    dayDiv.onclick = () => openAddEventModal(dateKey);
    calendarDays.appendChild(dayDiv);
  }
}

prevMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
