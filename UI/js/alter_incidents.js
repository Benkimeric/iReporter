const base_URL = 'https://ireporter-api-heroku.herokuapp.com/api/v2/'

// token from login
const token = localStorage.getItem('token')
const access_token = "Bearer " + token

// check if token exist during load
if (token === null) {
    window.location.replace("./login.html")
}

function hide_label() {
    let edit_comment_label = document.getElementById('edit_comment_label')
    window.setTimeout(function () {
        if (edit_comment_label) {
            edit_comment_label.innerHTML = ""
        }
    }, 2000)
}

function login_redirect() {
    window.setTimeout(function () {
        window.location.replace("./login.html")
    }, 3000)
}

// Edit Record
function loadEditData() {
    // if no data to load redirect to my incidents
    if (localStorage.getItem('record_comment') == null) {
        window.location.replace("./list.html")
    }

    document.getElementById('edit_comment').value = localStorage.getItem('record_comment')
    document.getElementById('edit_record_type').innerHTML = localStorage.getItem('record_type')
}

function clearVars() {
    localStorage.removeItem('record_comment')
    localStorage.removeItem('record_id')
    localStorage.removeItem('edit_record_type')
}

var edit_comment_form = document.getElementById('edit_comment_form');
if (edit_comment_form) {
    edit_comment_form.addEventListener('submit', editComment);
}

function editComment(e) {
    e.preventDefault();

    let type_record = localStorage.getItem('record_type')
    let id_record = localStorage.getItem('record_id')
    let comment = document.getElementById('edit_comment').value;

    fetch(`${base_URL}${type_record}/${id_record}/comment`, {
        method: 'PATCH',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Authorization": access_token
        },
        body: JSON.stringify({

            comment: comment
        })
    })
        .then((res) => res.json())
        //   .then((data) => console.log(data))
        .then((data) => {
            if (data.status == 403) {
                let edit_comment_label = document.getElementById('edit_comment_label')
                if (edit_comment_label) {
                    edit_comment_label.innerHTML = data.message
                    hide_label()
                }
            } else if (data.message == 'Updated ' + type_record + ' records comment') {
                let edit_comment_label = document.getElementById('edit_comment_label')
                if (edit_comment_label) {
                    document.getElementById("edit_comment_label").style.color = "green";
                    edit_comment_label.innerHTML = data.message
                    hide_label()
                }
            }
            else if (data.message == 'Internal Server Error') {
                let edit_comment_label = document.getElementById('edit_comment_label')
                if (edit_comment_label) {
                    edit_comment_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            }
            else {
                let edit_comment_label = document.getElementById('edit_comment_label')
                if (edit_comment_label) {
                    edit_comment_label.innerHTML = data.message
                }
            }
        })
        .catch((err) => console.log(err))
}

function logout() {
    localStorage.removeItem('token');
    window.location.replace("./login.html")
}

// edit location
function hide_location_label() {
    let edit_location_label = document.getElementById('edit_location_label')
    window.setTimeout(function () {
        if (edit_location_label) {
            edit_location_label.innerHTML = ""
        }
    }, 2000)
}

var edit_location_form = document.getElementById('edit_location_form');
if (edit_location_form) {
    edit_location_form.addEventListener('submit', editLocation);
}

function editLocation(e) {
    e.preventDefault();

    let type_record = localStorage.getItem('record_type')
    let id_record = localStorage.getItem('record_id')
    let location = document.getElementById('location_lat_long').value;

    fetch(`${base_URL}${type_record}/${id_record}/location`, {
        method: 'PATCH',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Authorization": access_token
        },
        body: JSON.stringify({

            location: location
        })
    })
        .then((res) => res.json())
        //   .then((data) => console.log(data))
        .then((data) => {
            if (data.status == 403) {
                let edit_location_label = document.getElementById('edit_location_label')
                if (edit_location_label) {
                    edit_location_label.innerHTML = data.message
                    hide_location_label()
                }
            } else if (data.message == 'Updated ' + type_record + ' records location') {
                let edit_location_label = document.getElementById('edit_location_label')
                if (edit_location_label) {
                    document.getElementById("edit_location_label").style.color = "green";
                    edit_location_label.innerHTML = data.message
                    hide_location_label()
                }
            }
            else if (data.message == 'Internal Server Error') {
                let edit_location_label = document.getElementById('edit_location_label')
                if (edit_location_label) {
                    edit_location_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            }
            else {
                let edit_location_label = document.getElementById('edit_location_label')
                if (edit_location_label) {
                    edit_location_label.innerHTML = data.message
                    hide_location_label()
                }
            }
        })
        .catch((err) => console.log(err))
}
