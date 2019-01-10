const base_URL = 'https://ireporter-api-heroku.herokuapp.com/api/v2/'

// token from login
const token = localStorage.getItem('token')
const access_token = "Bearer " + token

// check if token exist during load
if (token === null) {
  window.location.replace("./login.html")
}

// ***************post incident record******************//
var new_incident_form = document.getElementById('new_incident_form');
if (new_incident_form) {
  new_incident_form.addEventListener('submit', New_Incident);
}

// hide information label
function hide_label() {
  let flags_error_label = document.getElementById('flags_error_label')
  window.setTimeout(function () {
      if (flags_error_label) {
        flags_error_label.innerHTML = ""
      }
  }, 3000)
}

function logout() {
  localStorage.removeItem('token');
  window.location.replace("./login.html")
}

function login_redirect() {
  window.setTimeout(function () {
      window.location.replace("./login.html")
  }, 5000)
}

function New_Incident(e) {
  e.preventDefault();

  // record_type variable to be used in both url and type**
  let record_type = document.getElementById('record_type').value;
  let comment = document.getElementById('description').value;
  let location = document.getElementById('location').value;

  fetch(`${base_URL}${record_type}`, {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
      "Authorization": access_token
    },
    body: JSON.stringify({
      record_type: record_type,
      location: location,
      comment: comment
    })
  })
    .then((res) => res.json())
    // .then((data) => console.log(data))
    .then((data) => {
      if (data.status == 201) {
        let flags_error_label = document.getElementById('flags_error_label')
        if (flags_error_label) {
          document.getElementById("flags_error_label").style.color="green";
          flags_error_label.innerHTML = data.data[0].message
          hide_label()
          document.getElementById("new_incident_form").reset();
        }
      }else if (data.message == 'Internal Server Error') {
        let flags_error_label = document.getElementById('flags_error_label')
        if (flags_error_label) {
            flags_error_label.innerHTML = "Session has expired, you will be redirected to login again"
            login_redirect()
        }
    }
      else {
        let flags_error_label = document.getElementById('flags_error_label')
        if (flags_error_label) {
          flags_error_label.innerHTML = data.message
        }
      }
    })
    .catch((err) => console.log(err))
}
