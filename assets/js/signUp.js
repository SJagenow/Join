let users = [];

// Exportieren der users-Variable
// export { users };

let newID = 0;

async function init() {
  users = JSON.parse(await getItem("users")) || [];
}

async function addUser() {
  let name = document.getElementById('names').value;
  let email = document.getElementById('emails').value;
  let password = document.getElementById('passwords').value;

  users.push({ name: name, email: email, password: password });
  await setItem('users', JSON.stringify(users));
  newID += newID + 1;
  console.log(newID);
  //weiterleitung zu Login-Seite
  window.location.href = "../logIn.html";
  // window.location.href = "../../logIn.html?msg=Du hast dich erfolgreich registriert";
}
