async function initSummary() {
  await init();
  await getTodosForBoard();
  updateGreeting();
  await renderNumbersOfTasks();
}

let todo = [];


async function getTodosForBoard() {
    todo = JSON.parse(await getItem('tasks'));
    console.log(todo);
}


async function getCurrentUser() {
  let userName = JSON.parse(localStorage.getItem("currentUserName"));
  let summaryUserName = document.getElementById('summary-userName');
  console.log(userName);

  if (userName) {
    summaryUserName.textContent = userName;
  } else {
    summaryUserName.textContentt = "Guest";
  }
  let { profileinitials } = getInitials(userName);
  document.getElementById('header_initials').innerHTML = `${profileinitials.toUpperCase()}`;
}

function getInitials(contact) {
  const contactString = String(contact); // Konvertierung des Inputs zu einem String
  const words = contactString.split(" ");
  const firstName = words[0][0];
  const secondName = words[1] ? words[1][0] : '';
  const profileinitials = firstName + secondName;
  return { profileinitials }; // Rückgabe von profileinitials und secondName als Objekt
}


function updateGreeting() {
  let greetingTime = document.getElementById("greet");
  let currentDate = new Date();
  let currentHour = currentDate.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    greetingTime.textContent = "Good Morning,";
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingTime.textContent = "Good Afternoon,";
  } else {
    greetingTime.textContent = "Good Evening,";
  }
}

async function renderNumbersOfTasks() {
  let numberOfToDo = document.getElementById('task-counter-todo');
  let numberOfDone = document.getElementById('task-counter-done');
  let numberOfUrgent = document.getElementById('urgent-counter');
  let numberOfAll = document.getElementById('task-counter-all');
  let numberInProgress = document.getElementById('task-counter-Inprogress');
  let numberOfAwait = document.getElementById('task-counter-awaiting');
  let countToDo = 0;
  let countDone = 0;
  let countUrgent = 0;
  let countAll = todo.length;
  let countInProgress = 0;
  let countAwait = 0;
  for (let i = 0; i < todo.length; i++) {
      if (todo[i].category === 'todos') {
          countToDo++;
      } else if (todo[i].category === 'done') {
          countDone++;
      } else if (todo[i].category === 'inprogress') {
          countInProgress++;
      } else if (todo[i].category === 'await') {
          countAwait++;
      }
      if (todo[i].priority === 'urgent') {
          countUrgent++;
      }
  }
  numberOfToDo.innerText = countToDo;
  numberOfDone.innerText = countDone;
  numberOfUrgent.innerText = countUrgent;
  numberOfAll.innerText = countAll;
  numberInProgress.innerText = countInProgress;
  numberOfAwait.innerText = countAwait;
  renderNearestDueDate();
}

function renderNearestDueDate() {
  let nearestDueDateContainer = document.getElementById('deadline-date');
  let currentDate = new Date();
  let nearestDueDate = new Date('9999-12-31');
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].dueDate) {

      let todoDueDate = new Date(todo[i].dueDate);
      if (todoDueDate > currentDate && todoDueDate < nearestDueDate) {
        nearestDueDate = todoDueDate;
      }
    }
  }
  nearestDueDateContainer.innerText = nearestDueDate.toLocaleDateString(); 
}
