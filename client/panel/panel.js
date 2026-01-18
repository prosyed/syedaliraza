var throbbers = document.getElementsByClassName("throbber");
var corkboard = document.getElementById("corkboard");
var directory = document.getElementById("directory");
var viewer = document.getElementById("viewer");
var viewerChamber = document.getElementById("viewer-chamber");
var viewerHidden = true;
const pullUrl = "https://www.syedaliraza.com/.netlify/functions/pull?path=";

async function loadPanel() {
    corkboard.innerHTML = cork;
    throbbers[0].style.display = 'none';
    await pull(false, "/");
    throbbers[1].style.display = 'none';
}

async function pull(file, path) {
    if (file && viewerHidden) {
        viewerChamber.style.display = "block";
        viewerHidden = true;
    }
    const target = file ? viewer : directory;
    try {
        const response = await fetch(pullUrl + path);
        const data = await response.json();
        if (response.ok) {
            file ? fillViewer(path, data) : fillDirectory(path, data);
        }
        else target.innerHTML = JSON.stringify(data);
    }
    catch (error) {
        target.innerHTML = error;    
    }
    if (file) throbbers[2].style.display = 'none';
}

function fillDirectory(path, contents) {
    directory.innerHTML = `<tr class="current"><td colspan="3">${path}</td></tr>`;
    if (path != "/") directory.innerHTML += `<tr class="folder" onclick="pull(false, '${path.replace(/\/?[^\/]+\/?$/, "")}/')"><td class="ico">📁</td><td class="value">...</td><td class="size"></td></tr>`;
    const folders = contents.filter(c => c.type == "dir").sort((a, b) => a.name.localeCompare(b.name));
    for (const folder of folders) {
        directory.innerHTML += `<tr class="folder" onclick="pull(false, '${path + folder.name}/')"><td class="ico">📁</td><td class="value">${folder.name}</td><td class="size"></td></tr>`
    }
    const files = contents.filter(c => c.type == "file").sort((a, b) => a.name.localeCompare(b.name));
    for (const file of files) {
        const ext = file.name.split('.').pop();
        const eve = Object.keys(extensionMappings).includes(ext) ? `onclick="pull(true, '${path + file.name}/')"` : "";
        directory.innerHTML += `<tr class="file ${!eve ? "non" : ''}" ${eve}><td class="ico">📄</td><td class="value">${file.name}</td><td class="size">${file.size}</td></tr>`
    }
}

function fillViewer(path, contents) {
    viewer.innerHTML = atob(contents.content)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const ext = path.split('.').pop().slice(0, -1);
    viewer.className = `language-${extensionMappings[ext] || "plaintext"}`;
    viewer.removeAttribute("data-highlighted");
    hljs.highlightElement(viewer);
}

window.addEventListener("load", loadPanel);