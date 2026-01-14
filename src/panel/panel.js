var corkboard = document.getElementById("corkboard");

function loadPanel() {
    corkboard.innerHTML = cork;
}

window.addEventListener("load", loadPanel);