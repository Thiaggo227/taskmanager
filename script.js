
const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');


menuIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.classList.toggle('active');

  const isActive = menu.classList.contains('active');
  if (isActive) {
    menuIcon.classList.replace('bi-list', 'bi-x');
  } else {
    menuIcon.classList.replace('bi-x', 'bi-list');
  }
});

document.addEventListener('click', (e) => {
  if (menu.classList.contains('active') && !menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove('active');
    menuIcon.classList.replace('bi-x', 'bi-list');
  }
});

// --- LÓGICA DAS TAREFAS ---
function addTask() {
  const taskText = todoInput.value.trim();

  if (taskText === "") {
    alert("Por favor, digite uma tarefa!");
    return;
  }

  // Cria o container da tarefa
  const taskBox = document.createElement('div');
  taskBox.classList.add('box');

  // Estrutura interna (Ícone OK + Texto + Lixeira)
  taskBox.innerHTML = `
    <div class="input-group">
      <i class="bi bi-check-circle-fill" style="color: #28a745; font-size: 20px;"></i>
      <span class="task-item-text">${taskText}</span>
      <button class="btnApagar">
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  `;

  taskList.appendChild(taskBox);

  // Limpa e foca no input
  todoInput.value = "";
  todoInput.focus();

  // Evento para apagar
  taskBox.querySelector('.btnApagar').addEventListener('click', () => {
    taskBox.remove();
  });
}

// Eventos de gatilho
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

let totalEntry = 0;
let totalExit = 0;

function addEntry() {
  const value = Number(document.getElementById("value").value);

  if (value <= 0) return;

  totalEntry += value;
  updateValues();
}

function addExit() {
  const value = Number(document.getElementById("value").value);

  if (value <= 0) return;

  totalExit += value;
  updateValues();
}

function updateValues() {
  document.getElementById("entry").innerText = totalEntry.toFixed(2);
  document.getElementById("exit").innerText = totalExit.toFixed(2);
  document.getElementById("balance").innerText =
    (totalEntry - totalExit).toFixed(2);

  document.getElementById("value").value = "";
}
function resetValues(){
  totalEntry = 0;
  totalExit = 0;

  document.getElementById("entry").innerText = "0.00";
  document.getElementById("exit").innerText = "0.00";
  document.getElementById("balance").innerText = "0.00";
}