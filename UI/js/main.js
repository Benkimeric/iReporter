var modal = document.getElementById('myModal');
var btns = document.querySelectorAll('.myBtn'); 
var span = document.getElementsByClassName("close")[0];

[].forEach.call(btns, function(el) {
  el.onclick = function() {
      modal.style.display = "block";
  }
})
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}