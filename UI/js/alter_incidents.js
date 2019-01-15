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

// add image
function hide_image_label() {
    let edit_image_label = document.getElementById('edit_image_label')
    window.setTimeout(function () {
        if (edit_image_label) {
            edit_image_label.innerHTML = ""
        }
    }, 2000)
}

var edit_image_form = document.getElementById('edit_image_form');
if (edit_image_form) {
    edit_image_form.addEventListener('submit', addImage);
}

function addImage(e) {
    e.preventDefault();

    let type_record = localStorage.getItem('record_type')
    let id_record = localStorage.getItem('record_id')

    let formdata = new FormData();
    formdata.append('file', document.getElementById("image").files[0]);
    fetch(`${base_URL}${type_record}/${id_record}/images`, {
        method: 'PATCH',
        body: formdata,
        headers: {
            'Authorization': access_token
        }
    })
        .then(res => res.json())
        .then((data) => {
            if (data.status == 403) {
                let edit_image_label = document.getElementById('edit_image_label')
                if (edit_image_label) {
                    edit_image_label.innerHTML = data.message
                    hide_image_label()
                }
            } else if (data.status == 200) {
                let edit_image_label = document.getElementById('edit_image_label')
                if (edit_image_label) {
                    document.getElementById("edit_image_label").style.color = "green";
                    edit_image_label.innerHTML = data.message
                    hide_image_label()
                }
            }
            else if (data.message == 'Internal Server Error') {
                let edit_image_label = document.getElementById('edit_image_label')
                if (edit_image_label) {
                    edit_image_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            }
            else {
                let edit_image_label = document.getElementById('edit_image_label')
                if (edit_image_label) {
                    edit_image_label.innerHTML = data.message
                    hide_image_label()
                }
            }
        })
        .catch((err) => console.log(err))
}

function hide_video_label() {
    let edit_video_label = document.getElementById('edit_video_label')
    window.setTimeout(function () {
        if (edit_video_label) {
            edit_video_label.innerHTML = ""
        }
    }, 2000)
}

var edit_video_form = document.getElementById('edit_video_form');
if (edit_video_form) {
    edit_video_form.addEventListener('submit', addVideo);
}

function addVideo(e) {
    e.preventDefault();

    let type_record = localStorage.getItem('record_type')
    let id_record = localStorage.getItem('record_id')

    let formdata = new FormData();
    formdata.append('file', document.getElementById("video").files[0]);
    fetch(`${base_URL}${type_record}/${id_record}/video`, {
        method: 'PATCH',
        body: formdata,
        headers: {
            'Authorization': access_token
        }
    })
        .then(res => res.json())
        .then((data) => {
            if (data.status == 403) {
                let edit_video_label = document.getElementById('edit_video_label')
                if (edit_video_label) {
                    edit_video_label.innerHTML = data.message
                    hide_video_label()
                }
            } else if (data.status == 200) {
                let edit_video_label = document.getElementById('edit_video_label')
                if (edit_video_label) {
                    document.getElementById("edit_video_label").style.color = "green";
                    edit_video_label.innerHTML = data.message
                    hide_video_label()
                }
            }
            else if (data.message == 'Internal Server Error') {
                let edit_video_label = document.getElementById('edit_video_label')
                if (edit_video_label) {
                    edit_video_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            }
            else {
                let edit_video_label = document.getElementById('edit_video_label')
                if (edit_video_label) {
                    edit_video_label.innerHTML = data.message
                    hide_video_label()
                }
            }
        })
        .catch((err) => console.log(err))
}
