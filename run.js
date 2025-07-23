var menu = document.getElementById("menu");
var thorax = document.getElementById("thorax");
var thoraxTran = 0;
var stamp = document.getElementById("stamp");
var stampTran = 0;
var heart = document.getElementById("heart");
var heartTran = 0;
var valve = document.getElementById("valve");
var back = document.getElementById("back");

function loadWindow() {
    if (document.fonts.ready) {
        document.fonts.ready.then(() => {
            document.body.style.display = 'block';
        });
    }
    Object.keys(qua).forEach(member => {
        const item = document.createElement("div");
        item.classList.add('item');
        item.setAttribute("onclick", "clickItem(this.innerHTML)");
        item.innerHTML = member;
        menu.append(item);
    })
}

function clickItem(item) {
    valve.innerHTML = qua[item];
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

window.addEventListener("load", loadWindow);
back.addEventListener("click", clickBack);
thorax.addEventListener("transitionend", transitionThorax);
stamp.addEventListener("transitionend", transitionStamp);
heart.addEventListener("transitionend", transitionHeart);