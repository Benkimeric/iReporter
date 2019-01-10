const base_URL = 'https://ireporter-api-heroku.herokuapp.com/api/v2/'

// token from login
const token = localStorage.getItem('token')
const access_token = "Bearer " + token

// check if token exist during load
if (token === null) {
    window.location.replace("./login.html")
}
function login_redirect() {
    window.setTimeout(function () {
        window.location.replace("./login.html")
    }, 3000)
}

function loadData(){
    draft_flags()
    showRedDrafts()
    showInterventionDrafts()
    investigationInterventions()
    investigationflags()
    resolvedInterventions()
    resolvedflags()
    rejectedInterventions()
    rejectedFlags()
}
function draft_flags(e) {
    window.draft_flag = document.getElementById("draft_span").getAttribute("data-value");
    window.draft_state = document.getElementById("draft_span").getAttribute("data-state");
}
function showRedDrafts() {
    fetch(`${base_URL}user/${draft_flag}/${draft_state}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        // .then((data) => console.log(data.count[0]))
        .then((data) => {
            if (data.status == 200) {
                let draft_span = document.getElementById('draft_span')
                if (draft_span) {
                    draft_span.innerHTML = data.count[0]
                }
            } else if (data.message == 'Internal Server Error') {
                let home_label = document.getElementById('home_label')
                if (home_label) {
                    home_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            }
        })
        .catch((err) => console.log(err))
}

function logout() {
    localStorage.removeItem('token');
    window.location.replace("./login.html")
}

function showInterventionDrafts() {
    fetch(`${base_URL}user/intervention/draft`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let intervention_draft = document.getElementById('intervention_draft')
                if (intervention_draft) {
                    intervention_draft.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}

function investigationInterventions() {
    fetch(`${base_URL}user/intervention/under investigation`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let inter_investi = document.getElementById('inter_investi')
                if (inter_investi) {
                    inter_investi.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}

function investigationflags() {
    fetch(`${base_URL}user/red-flag/under investigation`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let flag_investi = document.getElementById('flag_investi')
                if (flag_investi) {
                    flag_investi.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}

function resolvedInterventions() {
    fetch(`${base_URL}user/intervention/resolved`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let resolv_interv = document.getElementById('resolv_interv')
                if (resolv_interv) {
                    resolv_interv.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}

function resolvedflags() {
    fetch(`${base_URL}user/red-flag/resolved`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let resolv_flags = document.getElementById('resolv_flags')
                if (resolv_flags) {
                    resolv_flags.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}

function rejectedInterventions() {
    fetch(`${base_URL}user/intervention/rejected`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let reject_interv = document.getElementById('reject_interv')
                if (reject_interv) {
                    reject_interv.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}

function rejectedFlags() {
    fetch(`${base_URL}user/red-flag/rejected`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            "Authorization": access_token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 200) {
                let reject_flags = document.getElementById('reject_flags')
                if (reject_flags) {
                    reject_flags.innerHTML = data.count[0]
                }
            }
        })
        .catch((err) => console.log(err))
}
