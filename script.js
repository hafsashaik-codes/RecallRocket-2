let cards = JSON.parse(localStorage.getItem("rocketCards")) || [
    {
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language",
        category: "Technology",
        learned: false
    },
    {
        question: "What is CSS used for?",
        answer: "CSS is used to style and design web pages.",
        category: "Programming",
        learned: false
    },
    {
        question: "What is JavaScript?",
        answer: "JavaScript is a programming language used to make websites interactive.",
        category: "Programming",
        learned: false
    },
    {
        question: "What is an algorithm?",
        answer: "A step-by-step procedure to solve a problem.",
        category: "General",
        learned: false
    },
    {
        question: "What is the value of Pi?",
        answer: "Approximately 3.14159",
        category: "Mathematics",
        learned: false
    }
];

let currentIndex = 0;
let isFlipped = false;

let sessions = Number(localStorage.getItem("rocketSessions")) || 0;

function saveData() {
    localStorage.setItem("rocketCards", JSON.stringify(cards));
    localStorage.setItem("rocketSessions", sessions);
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

    if (sectionId === "study") {
        sessions++;
        saveData();
        isFlipped = false;
        displayCard();
    }

    updateDashboard();
}

function displayCard() {
    const text = document.getElementById("cardText");
    const label = document.getElementById("cardLabel");
    const number = document.getElementById("cardNumber");

    if (cards.length === 0) {
        text.textContent = "No flashcards available. Create one!";
        label.textContent = "WELCOME";
        number.textContent = "Card 0 of 0";
        return;
    }

    currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));

    const card = cards[currentIndex];

    text.textContent = isFlipped ? card.answer : card.question;
    label.textContent = isFlipped ? "ANSWER" : "QUESTION";

    number.textContent =
        `Card ${currentIndex + 1} of ${cards.length}`;
}

function flipCard() {
    if (cards.length === 0) return;

    isFlipped = !isFlipped;
    displayCard();
}

function nextCard() {
    if (cards.length === 0) return;

    currentIndex = (currentIndex + 1) % cards.length;
    isFlipped = false;
    displayCard();
}

function previousCard() {
    if (cards.length === 0) return;

    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    isFlipped = false;
    displayCard();
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    currentIndex = 0;
    isFlipped = false;
    saveData();
    displayCard();
}

function markLearned() {
    if (cards.length === 0) return;

    cards[currentIndex].learned = true;

    saveData();
    updateDashboard();

    alert("Great job! Card marked as mastered.");

    nextCard();
}

document.getElementById("cardForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer").value.trim();
    const category = document.getElementById("category").value;

    if (!question || !answer) {
        alert("Please enter both question and answer.");
        return;
    }

    cards.push({
        question: question,
        answer: answer,
        category: category,
        learned: false
    });

    saveData();

    this.reset();

    currentIndex = cards.length - 1;

    alert("Your flashcard has been added successfully!");

    updateDashboard();
    displayCard();
    showSection("study");
});

function updateDashboard() {
    const total = cards.length;
    const learned = cards.filter(card => card.learned).length;

    document.getElementById("totalCards").textContent = total;
    document.getElementById("learnedCards").textContent = learned;
    document.getElementById("studyCount").textContent = sessions;

    const percentage = total === 0
        ? 0
        : Math.round((learned / total) * 100);

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% completed";

    renderCardList();
}

function renderCardList() {
    const list = document.getElementById("cardList");

    list.innerHTML = "";

    if (cards.length === 0) {
        list.textContent = "No cards created yet.";
        return;
    }

    cards.forEach((card, index) => {
        const item = document.createElement("div");
        item.className = "card-item";

        const title = document.createElement("strong");
        title.textContent = card.question;

        const category = document.createElement("p");
        category.textContent =
            "Category: " + card.category +
            " | " + (card.learned ? "Mastered ✓" : "Not mastered");

        const removeButton = document.createElement("button");
        removeButton.textContent = "Delete Card";

        removeButton.addEventListener("click", () => {
            deleteCard(index);
        });

        item.appendChild(title);
        item.appendChild(category);
        item.appendChild(removeButton);

        list.appendChild(item);
    });
}

function deleteCard(index) {
    if (!confirm("Are you sure you want to delete this card?")) {
        return;
    }

    cards.splice(index, 1);

    if (currentIndex >= cards.length) {
        currentIndex = Math.max(0, cards.length - 1);
    }

    isFlipped = false;

    saveData();
    updateDashboard();
    displayCard();
}

function resetProgress() {
    if (!confirm("Reset all mastered cards?")) return;

    cards.forEach(card => {
        card.learned = false;
    });

    saveData();
    updateDashboard();

    alert("Learning progress has been reset!");
}

saveData();
displayCard();
updateDashboard();