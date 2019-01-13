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
    localStorage.removeItem('location_lats');
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        localStorage.removeItem('location_lats');
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
// hide information label
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
                    if (data.message == 'Internal Server Error') {
                        let timeout_label = document.getElementById('timeout_label')
                        if (timeout_label) {
                            timeout_label.innerHTML = "Session has expired, you will be redirected to login again"
                            login_redirect()
                        }
                    } else{
                        localStorage.setItem('location_lats', data.data.location)
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
                              <tr>
                              <h3>Location</h3>
                              
                              </tr>
                              `;

                    document.getElementById('one_record').innerHTML = records;
                    }
                })
                .catch((err) => console.log(err))
        }
    }

}

function get_user_record_type(e) {
    window.record_type = e.getAttribute("data-value");
    getUserRecords()
}

function hide_user_label() {
    let user_timeout_label = document.getElementById('user_timeout_label')
    window.setTimeout(function () {
        if (user_timeout_label) {
            user_timeout_label.innerHTML = ""
        }
    }, 2000)
}

function logout() {
    localStorage.removeItem('token');
    window.location.replace("./login.html")
}

// display logged in user records
function getUserRecords() {
    fetch(`${base_URL}user/${record_type}`, {
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
                let user_timeout_label = document.getElementById('user_timeout_label')
                if (user_timeout_label) {
                    user_timeout_label.innerHTML = data.message
                    hide_user_label()
                }
            } else if (data.message == 'Internal Server Error') {
                let user_timeout_label = document.getElementById('user_timeout_label')
                if (user_timeout_label) {
                    user_timeout_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            } else {
                let records = `
                            <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                            </tr>
                            `;
                data['data'].forEach(function (record) {
                    records += `
              <tr>
                  <td>${record.id}</td>
                  <td>${record.type}</td>
                  <td>${record.comment}</td>
                  <td>${record.status}</td>
                  <td><button class="myBtn" onclick="openUserRecord()"> Open </button></td>
                  <td><button class="myBtn" style="background-color:grey" onclick="redirect()"> Edit </button></td>
                  <td><button class="myBtn" style="background-color:#E67373" onclick="deleteRecord()"> Delete </button></td>
              </td>
              </tr>
            `;
                });
                document.getElementById('user_records').innerHTML = records;
            }
        })
        .catch((err) => console.log(err))
}

// open on modal upon clicking open button in all incidents table
function openUserRecord() {
    populate_user_modal()
    modal.style.display = "block";
}

function populate_user_modal() {
    var ref_table = document.getElementById('user_records')

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
                    if (data.message == 'Internal Server Error') {
                        let user_timeout_label = document.getElementById('user_timeout_label')
                        if (user_timeout_label) {
                            user_timeout_label.innerHTML = "Session has expired, you will be redirected to login again"
                            login_redirect()
                        }
                    } else {
                        localStorage.setItem('location_lats', data.data.location)
                    let user_records = `
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
                              <tr>
                              <h3>Location</h3>
                              
                              </tr>
                              `;

                    document.getElementById('one_user_record').innerHTML = user_records;
                    }
                })
                .catch((err) => console.log(err))
        }
    }

}

// delete incidents
function deleteRecord() {
    var ref_table = document.getElementById('user_records')
    var delete_confirm = confirm("Are you sure you want to delete this record?\nPress OK to DELETE and Cancel to Abort");
    if (delete_confirm == true) {
        for (var i = 0; i < ref_table.rows.length; i++) {
            ref_table.rows[i].onclick = function () {
                record_id = this.cells[0].innerHTML;
                type_of_record = this.cells[1].innerHTML;

                fetch(`${base_URL}${type_of_record}/` + record_id, {
                    method: 'DELETE',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Request-Method': '*',
                        "Authorization": access_token
                    }
                })
                    .then((res) => res.json())
                    // .then((data) => console.log(data))
                    .then((data) => {
                        if (data.message == type_of_record + " has been deleted") {
                            let user_timeout_label = document.getElementById('user_timeout_label')
                            if (user_timeout_label) {
                                user_timeout_label.innerHTML = data.message
                                window.setTimeout(function () {
                                    location.reload()
                                }, 3000);
                            }
                        } else if (data.message == 'Internal Server Error') {
                            let user_timeout_label = document.getElementById('user_timeout_label')
                            if (user_timeout_label) {
                                user_timeout_label.innerHTML = "Session has expired, you will be redirected to login again"
                                login_redirect()
                            }
                        } else if (data.status == 403) {
                            let user_timeout_label = document.getElementById('user_timeout_label')
                            if (user_timeout_label) {
                                user_timeout_label.innerHTML = data.message
                                hide_user_label()
                            }
                        } else {
                            let user_timeout_label = document.getElementById('user_timeout_label')
                            if (user_timeout_label) {
                                user_timeout_label.innerHTML = data.message
                                hide_user_label()
                            }
                        }
                    })
                    .catch((err) => console.log(err))
            }
        }
    } else {
        let user_timeout_label = document.getElementById('user_timeout_label')
        if (user_timeout_label) {
            user_timeout_label.innerHTML = "Record Not Deleted"
            hide_user_label()
        }
    }

}

function redirect() {
    var ref_table = document.getElementById('user_records')

    for (var i = 0; i < ref_table.rows.length; i++) {
        ref_table.rows[i].onclick = function () {
            localStorage.setItem('record_id', this.cells[0].innerHTML)
            localStorage.setItem('record_type', this.cells[1].innerHTML)
            localStorage.setItem('record_comment', this.cells[2].innerHTML)

            window.location.href = "editflag.html"
        }
    }

}
// admin view all records
function admin_record_type(e) {
    window.record_type = e.getAttribute("data-value");
    adminView() // display record type on click
}

function adminView() {
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
                let admin_label = document.getElementById('admin_label')
                if (admin_label) {
                    admin_label.innerHTML = data.message
                    hide_admin_label()
                }
            } else if (data.message == 'Internal Server Error') {
                let admin_label = document.getElementById('admin_label')
                if (admin_label) {
                    admin_label.innerHTML = "Session has expired, you will be redirected to login again"
                    login_redirect()
                }
            } else {
                let records = `
                        <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Change Status To:</th>
                        </tr>
                        `;
                data['data'].forEach(function (record) {
                    records += `
          <tr>
              <td>${record.id}</td>
              <td>${record.type}</td>
              <td>${record.comment}</td>
              <td>${record.status}</td>
              <td>
                <select name="field4" id="status_select" class="field-select" onChange="updateStatus()">
                <option disabled selected>Set Status To:</option>
                <option >resolved</option>
                <option >rejected</option>
                <option >draft</option>
                <option >under investigation</option>
                </select>
              </td>
          </td>
              <td><button class="myBtn" onclick="adminOpenRecord()"> Open </button></td>
          </tr>
        `;
                });
                document.getElementById('admin_view_all').innerHTML = records;
            }
        })
        .catch((err) => console.log(err))
}

function hide_admin_label() {
    let admin_label = document.getElementById('admin_label')
    window.setTimeout(function () {
        if (admin_label) {
            admin_label.innerHTML = ""
        }
    }, 2000)
}

function adminOpenRecord() {
    adminPopulateModal()
    modal.style.display = "block";
}

function adminPopulateModal() {
    var admin_table = document.getElementById('admin_view_all')

    for (var i = 0; i < admin_table.rows.length; i++) {
        admin_table.rows[i].onclick = function () {
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
                    if (data.message == 'Internal Server Error') {
                        let admin_label = document.getElementById('admin_label')
                        if (admin_label) {
                            admin_label.innerHTML = "Session has expired, you will be redirected to login again"
                            login_redirect()
                        }
                    } else {
                        localStorage.setItem('location_lats', data.data.location)
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
                             
                              <tr>
                              <th>Description</th>
                              <td>${data.data.comment}</td>
                              </tr>
                              <tr>
                              <th>Image(click to open)</th>
                              <td>
                              <a target="_blank" href="media/image.png">
                              <img src="media/image.png" alt="Image display corruption" class="image">
                          </a>
                              </td>
                              </tr>
                              <tr>
                              <th>Videos</th>
                              <td>${data.data.video}</td>
                              </tr>
                              <tr>
                              <tr>
                              <h3>Location</h3>
                              
                              </tr>
                              `;

                    document.getElementById('admin_view_one').innerHTML = records;
                    }
                })
                .catch((err) => console.log(err))
        }
    }
}

function updateStatus() {
    var elementStatus = document.querySelectorAll('#status_select');

    elementStatus.forEach(function (elem) {
        elem.addEventListener("click", function (e) {
            // console.log(this.value)
            var new_status = this.value
            // patch
            var admin_table = document.getElementById('admin_view_all')

            for (var i = 0; i < admin_table.rows.length; i++) {
                admin_table.rows[i].onclick = function () {
                    record_id = this.cells[0].innerHTML;

                    fetch(`${base_URL}${record_type}/${record_id}/status`, {
                        method: 'PATCH',
                        headers: {
                            "Content-type": "application/json",
                            "Accept": "application/json",
                            "Authorization": access_token
                        },
                        body: JSON.stringify({
                            status: new_status
                        })
                    })
                        .then((res) => res.json())
                        // .then((data) => console.log(data))
                        .then((data) => {
                            if (data.status == 200) {
                                let admin_label = document.getElementById('admin_label')
                                if (admin_label) {
                                    document.getElementById("admin_label").style.color = "green";
                                    admin_label.innerHTML = data.message
                                    hide_admin_label()
                                }
                            } else if (data.message == 'Internal Server Error') {
                                let admin_label = document.getElementById('admin_label')
                                if (admin_label) {
                                    admin_label.innerHTML = "Session has expired, you will be redirected to login again"
                                    login_redirect()
                                }
                            }
                            else {
                                let admin_label = document.getElementById('admin_label')
                                if (admin_label) {
                                    admin_label.innerHTML = data.message
                                    hide_admin_label()
                                }
                            }
                        })
                        .catch((err) => console.log(err))
                }
            }

            // end patch
        });
    });
}

// google maps 
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 40.731, lng: -73.997}
    });
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    var element = document.getElementById('myModal')
    if (element){
        element.addEventListener('mouseover', function() {
            geocodeLatLng(geocoder, map, infowindow);
          });
    }
  }
  function geocodeLatLng(geocoder, map, infowindow) {
    var input = localStorage.getItem('location_lats')
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(11);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else if(status === 'OVER_QUERY_LIMIT'){
          console.log("Location geocoded")
      } else {
          console.log('Geocoder failed due to ' + status)
          window.alert('Map display failed');
          location.reload()
      }
    });
  }

