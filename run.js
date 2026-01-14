var throbber = document.getElementById("throbber");
var trunk = document.getElementById("trunk");
var foot = document.getElementById("foot");
var menu = document.getElementById("menu");
var thorax = document.getElementById("thorax");
var thoraxTran = 0;
var stamp = document.getElementById("stamp");
var stampTran = 0;
var heart = document.getElementById("heart");
var heartTran = 0;
var valve = document.getElementById("valve");
var back = document.getElementById("back");
var secret = 0;

async function loadWindow() {
    var preFont = new Date();
    var index = 0;
    for (const font of fonts) {
        document.fonts.add(font);
        font.load();
        await font.loaded;
        index++; 
        console.log(`${index}/${fonts.length} fonts loaded: ${font.style} ${font.weight} 1em ${font.family} (${(new Date() - preFont) / 1000}s)`); 
    }
    Object.keys(contents).forEach(member => {
        const item = document.createElement("div");
        item.classList.add('item');
        item.setAttribute("onclick", "clickItem(this.innerHTML)");
        item.innerHTML = member;
        menu.append(item);
    })
    throbber.style.display = 'none';
    trunk.style.display = 'block';
    foot.style.display = 'block';
}

function clickItem(item) {
    valve.innerHTML = contents[item];
    thorax.style.width = "100%";
    thoraxTran = 1;
}

function clickBack() {
    thorax.style.maxHeight = 'var(--unit)';
    heart.style.opacity = 0;
    heartTran = 1;
}

function transitionThorax() {
    if (thoraxTran == 1) {
        stamp.style.opacity = 0;
        stampTran = 1
    }
    else if (thoraxTran == 2) {
        stamp.style.display = 'block';
        stamp.offsetHeight;
        stamp.style.opacity = 1;
    }
}

function transitionStamp() {
    if (stampTran == 1) {
        stamp.style.display = 'none';
        heart.style.display = 'block';
        heart.offsetHeight;
        thorax.style.maxHeight = heart.scrollHeight + 'px';
        heart.style.opacity = 1;
    }
}

function transitionHeart() {
    if (heartTran == 1) {
        heart.style.display = 'none';
        heartTran = 0;
        thorax.style.width = "50%";
        thoraxTran = 2;
    }
}

function clickSecret() {
    secret++;
    if (secret === 5) {
        window.location.href = "panel";
        secret = 0;
    }
}

window.addEventListener("load", loadWindow);
back.addEventListener("click", clickBack);
thorax.addEventListener("transitionend", transitionThorax);
stamp.addEventListener("transitionend", transitionStamp);
heart.addEventListener("transitionend", transitionHeart);
thorax.addEventListener("click", clickSecret);