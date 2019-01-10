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
