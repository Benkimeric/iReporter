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

// sign up
var signup_form = document.getElementById('signup');
  if(signup_form){
    signup_form.addEventListener('submit', Signup);
  }

function Signup(e) {
  e.preventDefault();

  let fname = document.getElementById('fname').value;
  let lname = document.getElementById('lname').value;
  let mname = document.getElementById('mname').value;
  let username = document.getElementById('username').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;
  let pass = document.getElementById('pass').value;
  let pass2 = document.getElementById('pass2').value;

  fetch(`${base_URL}auth/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      first_name: fname,
      last_name: lname,
      other_names: mname,
      email: email,
      phone_number: phone,
      user_name: username,
      password: pass,
      confirm_password: pass2
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == 201) {
        // console.log(data)
        alert("Account created successfully. Click OK to login");
        window.location.href = "login.html";
      }
      else {
        let signup_error_label = document.getElementById('signup_error_label')
        if (signup_error_label) {
          signup_error_label.innerHTML = data.message
        }
      }
    })
    .catch((err) => console.log(err))
}

