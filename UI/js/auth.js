const base_URL = 'https://ireporter-api-heroku.herokuapp.com/api/v2/'

// Login
var login_form = document.getElementById('login');
  if(login_form){
    login_form.addEventListener('submit', Login);
  }

function Login(e) {
  e.preventDefault();

  let username = document.getElementById('username').value;
  let pass = document.getElementById('pass').value;

  fetch(`${base_URL}auth/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ user_name: username, password: pass })
  })
    .then((res) => res.json())
    // .then((data) => console.log(data))
    .then((data) => {
      // successful login
      if (data.status == 200) {
        localStorage.setItem('token', data.data[0].token)
        localStorage.setItem('current_userID', data.data[0]["user ID"])
        if (data.data[0].admin == true) {
          window.location.replace("./admin.html")
        } else {
          window.location.replace("./home.html")
        }
      }
      else {
        let error_label = document.getElementById('error_label')
        if (error_label) {
          error_label.innerHTML = data.message
        }
      }
    })
    .catch((err) => console.log(err))
}
