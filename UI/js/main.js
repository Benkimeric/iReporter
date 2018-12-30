const base_URL = 'https://ireporter-api-heroku.herokuapp.com/api/v2/'

// token from login
const token = localStorage.getItem('token')
const access_token = "Bearer " + token

// check if token exist during load
if (token === null) {
    window.location.replace("./login.html")
}

var modal = document.getElementById('myModal');
var btns = document.querySelectorAll('.myBtn');
var span = document.getElementsByClassName("close")[0];

[].forEach.call(btns, function (el) {
    el.onclick = function () {
        modal.style.display = "block";
    }
})
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// display inteventions by default
var record_type = 'intervention'

function get_record_type(e) {
    window.record_type = e.getAttribute("data-value");
    getRedFlags() // display record type on click
}

// redirect to login page
function login_redirect() {
    window.setTimeout(function () {
        window.location.replace("./login.html")
    }, 5000)
}
// reload page after 2 seconds
function hide_label() {
    let timeout_label = document.getElementById('timeout_label')
    window.setTimeout(function () {
        if (timeout_label) {
            timeout_label.innerHTML = ""
        }
    }, 2000)
}

function getRedFlags() {
    fetch(`${base_URL}${record_type}`, {
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
                let timeout_label = document.getElementById('timeout_label')
                if (timeout_label) {
                    timeout_label.innerHTML = data.message
                    hide_label()
                }
            } else if (data.message == 'Internal Server Error') {
                let timeout_label = document.getElementById('timeout_label')
                if (timeout_label) {
                    timeout_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            } else {
                let records = `
                        <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        </tr>
                        `;
                data['data'].forEach(function (record) {
                    records += `
          <tr>
              <td>${record.id}</td>
              <td>${record.type}</td>
              <td>${record.comment}</td>
              <td>${record.status}</td>
              <td><button class="myBtn" onclick="openRecord()"> Open </button></td>
          </td>
          </tr>
        `;
                });
                document.getElementById('all_records').innerHTML = records;
            }
        })
        .catch((err) => console.log(err))
}

// open on modal upon clicking open button in all incidents table
function openRecord() {
    populate_modal()
    modal.style.display = "block";
}

// populate modal table
function populate_modal() {
    var ref_table = document.getElementById('all_records')

    for (var i = 0; i < ref_table.rows.length; i++) {
        ref_table.rows[i].onclick = function () {
            record_id = this.cells[0].innerHTML;

            fetch(`${base_URL}${record_type}/` + record_id, {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Request-Method': '*',
                    "Authorization": access_token
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data.data)
                    let records = `
                              <tr>
                              <th>ID</th>
                              <td>${data.data.id}</td>
                              </tr>
                              <tr>
                              <th>Type</th>
                              <td>${data.data.type}</td>
                              </tr>
                              <tr>
                              <th>Status</th>
                              <td>${data.data.status}</td>
                              </tr>
                              <tr>
                              <th>Created On</th>
                              <td>${data.data.create_on}</td>
                              </tr>
                              <tr>
                              <th>Created By</th>
                              <td>${data.data.create_by}</td>
                              </tr>
                              <tr>
                              <th>Location</th>
                              <td>${data.data.location}</td>
                              </tr>
                              <tr>
                              <th>Description</th>
                              <td>${data.data.comment}</td>
                              </tr>
                              <tr>
                              <th>Image(click to open)</th>
                              <td>
                              <a target="_blank" href="media/image.png">
                              <img src="media/image.png" alt="Image deipaly corruption" class="image">
                          </a>
                              </td>
                              </tr>
                              <tr>
                              <th>Videos</th>
                              <td>${data.data.video}</td>
                              </tr>
                              <tr>
                              `;

                    document.getElementById('one_record').innerHTML = records;
                })
                .catch((err) => console.log(err))
        }
    }

}