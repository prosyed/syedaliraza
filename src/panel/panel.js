var throbs = document.getElementsByClassName("throb");
var corkboard = document.getElementById("corkboard");

function loadPanel() {
    corkboard.innerHTML = cork;
    throbs[0].style.display = 'none';
}

window.addEventListener("load", loadPanel);