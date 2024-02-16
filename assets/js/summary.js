async function initSummary() {
  await init();
  updateGreeting();
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