const base_URL = 'https://ireporter-api-heroku.herokuapp.com/api/v2/'

// token from login
const token = localStorage.getItem('token')
const access_token = "Bearer " + token

// check if token exist during load
if (token === null) {
    window.location.replace("./login.html")
}

function hide_label() {
    let profile_label = document.getElementById('profile_label')
    window.setTimeout(function () {
        if (profile_label) {
            profile_label.innerHTML = ""
        }
    }, 2000)
}

function login_redirect() {
    window.setTimeout(function () {
        window.location.replace("./login.html")
    }, 5000)
}

function logout() {
    localStorage.removeItem('token');
    window.location.replace("./login.html")
}

function viewProfile() {
    fetch(`${base_URL}users/profile`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        // .then((data) => console.log(data))
        .then((data) => {
            if (data.status == 404) {
                let profile_label = document.getElementById('profile_label')
                if (profile_label) {
                    profile_label.innerHTML = data.message
                    hide_label()
                }
            } else if (data.message == 'Internal Server Error') {
                let profile_label = document.getElementById('profile_label')
                if (profile_label) {
                    profile_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            } else if (data.status == 200) {
                let puser_name = document.getElementById('puser_name')
                let pfirst_name = document.getElementById('pfirst_name')
                let pother_name = document.getElementById('pother_name')
                let plast_name = document.getElementById('plast_name')
                let pphone = document.getElementById('pphone')
                let pemail = document.getElementById('pemail')

                puser_name.innerHTML = data.data.user_name
                pfirst_name.innerHTML = data.data.first_name
                pother_name.innerHTML = data.data.other_names
                plast_name.innerHTML = data.data.last_name
                pphone.innerHTML = data.data.phone
                pemail.innerHTML = data.data.email

            } else {
                let profile_label = document.getElementById('profile_label')
                if (profile_label) {
                    profile_label.innerHTML = data.message
                    hide_label()
                }
            }
        })
        .catch((err) => console.log(err))
}

// view all users
function viewUsers() {
    fetch(`${base_URL}users`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        // .then((data) => console.log(data))
        .then((data) => {
            if (data.status == 404) {
                let users_label = document.getElementById('users_label')
                if (users_label) {
                    users_label.innerHTML = data.message
                    hide_label()
                }
            } else if (data.message == 'Internal Server Error') {
                let users_label = document.getElementById('users_label')
                if (users_label) {
                    users_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            } else {
                let records = `
                        <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Other Names</th>
                        <th>UserName</th>
                        <th>Email</th>
                        </tr>
                        `;
                data['data'].forEach(function (record) {
                    records += `
          <tr>
              <td>${record.id}</td>
              <td>${record.first_name}</td>
              <td>${record.last_name}</td>
              <td>${record.other_names}</td>
              <td>${record.user_name}</td>
              <td>${record.email}</td>
              <td><button class="myBtn" onclick="makeAdmin()"> Make Admin </button></td>
          </td>
          </tr>
        `;
                });
                document.getElementById('all_users').innerHTML = records;
            }
        })
        .catch((err) => console.log(err))
}

function makeAdmin() {
    var users_table = document.getElementById('all_users')

    for (var i = 0; i < users_table.rows.length; i++) {
        users_table.rows[i].onclick = function () {
            user_id = this.cells[0].innerHTML;

            fetch(`${base_URL}makeadmin/` + user_id, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": access_token
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status == 200) {
                        let users_label = document.getElementById('users_label')
                        if (users_label) {
                            document.getElementById("users_label").style.color = "green";
                            users_label.innerHTML = data.message
                            hide_label()
                        }
                    } else if (data.message == 'Internal Server Error') {
                        let users_label = document.getElementById('users_label')
                        if (users_label) {
                            users_label.innerHTML = "Session has expired, you will be redirected to login again"
                            login_redirect()
                        }
                    }
                    else {
                        let users_label = document.getElementById('users_label')
                        if (users_label) {
                            users_label.innerHTML = data.message
                            hide_label()
                        }
                    }
                })
                .catch((err) => console.log(err))
        }
    }
}
