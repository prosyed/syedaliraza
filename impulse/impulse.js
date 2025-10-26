const screens = document.querySelectorAll(".screen");
let current = 0;
let answers = [];

const fieldMap = {
    A: "Neurology",
    B: "Neurosurgery",
    C: "Psychiatry",
    D: "Neuroscience Research"
};

screens.forEach(s => (s.style.display = "none"));
screens[0].style.display = "flex";

function start() {
    document.body.style.background = "#545fb1";
    slideTo(1);
}

document.querySelectorAll(".proceed").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const currentScreen = screens[current];
        const selected = currentScreen.querySelector(".option.selected");

        if (!selected) {
            alert("Please select an option before proceeding.");
            return;
        }

        answers.push(selected.id);
        setTimeout(() => {
            slideTo(index + 2);
        }, 200);
    });
});

document.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", () => {
        const parent = option.parentElement;
        parent.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
    });
});

function slideTo(nextIndex) {
    if (nextIndex >= screens.length) return;

    const currentScreen = screens[current];
    const nextScreen = screens[nextIndex];

    if (nextScreen.id === "endScreen") {
        document.body.style.background = "#fcfcfc";
        showResults();
    }

    nextScreen.style.display = "flex";
    nextScreen.style.transform = "translateX(100%)";

    requestAnimationFrame(() => {
        currentScreen.style.transition = "transform 0.6s ease-in-out";
        nextScreen.style.transition = "transform 0.6s ease-in-out";

        currentScreen.style.transform = "translateX(-100%)";
        nextScreen.style.transform = "translateX(0%)";

        setTimeout(() => {
            currentScreen.style.display = "none";
            currentScreen.style.transform = "";
            currentScreen.style.transition = "";
            nextScreen.style.transition = "";
            current = nextIndex;
        }, 600);
    });
}

function showResults() {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(ans => counts[ans]++);
    const max = Math.max(...Object.values(counts));
    const priority = ["A", "B", "C", "D"];
    const winner = priority.find(key => counts[key] === max);
    const resultText = fieldMap[winner];

    const endScreen = document.querySelector("#endScreen");
    const emoji = endScreen.querySelector("span");
    const h4 = endScreen.querySelector("h4");
    const h3 = endScreen.querySelector("h3");

    emoji.style.opacity = 0;
    h3.style.opacity = 0;
    h4.style.opacity = 0;
    h3.innerText = "";

    h4.innerText = "You belong to:";
    h4.classList.add("preblast");
    h4.style.opacity = 1;

    setTimeout(() => {
        h4.classList.remove("preblast");

        h3.innerText = resultText;
        h3.style.opacity = 1;
        h3.classList.add("blast");

        // 👇 appears *together* with h3
        emoji.style.opacity = 1;
        emoji.innerHTML = "🥳";
        emoji.classList.add("bounce");

        setTimeout(() => {
            h3.classList.remove("blast");
            emoji.classList.remove("bounce");
        }, 2000);

        console.log("Answer counts:", counts);
        console.log("Most frequent:", winner, "→", resultText);
    }, 2300);
}

