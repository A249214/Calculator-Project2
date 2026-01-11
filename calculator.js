// ===== ELEMENTS =====
const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

// ===== DISPLAY FUNCTIONS =====
function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

// ===== CALCULATE =====
function calculate() {
    if (!display.value) return;

    try {
        const expression = display.value;
        const result = eval(expression);

        display.value = result;
        addHistory(expression, result);
    } catch {
        display.value = "Error";
    }
}

// ===== HISTORY FUNCTIONS =====
function addHistory(expression, result) {
    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

    // Limit history to last 20 items
    if (history.length >= 20) history.pop();

    history.unshift({
        expression,
        result
    });

    localStorage.setItem("calcHistory", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    historyList.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("calcHistory")) || [];

    history.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "history-item";

        div.innerHTML = `
            <span class="history-text">${item.expression} = <b>${item.result}</b></span>
            <button class="delete-history" title="Delete" onclick="deleteHistory(${index})">✖</button>
        `;

        // Click history to reuse result
        div.onclick = (e) => {
            if (!e.target.classList.contains("delete-history")) {
                display.value = item.result;
            }
        };

        historyList.appendChild(div);
    });
}

function deleteHistory(index) {
    let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
    history.splice(index, 1);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    loadHistory();
}

function clearHistory() {
    if (confirm("Clear all calculator history?")) {
        localStorage.removeItem("calcHistory");
        loadHistory();
    }
}

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle("light");
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener("keydown", (e) => {
    if ("0123456789+-*/.".includes(e.key)) {
        appendToDisplay(e.key);
    }

    if (e.key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (e.key === "Backspace") {
        display.value = display.value.slice(0, -1);
    }

    if (e.key === "Escape") {
        clearDisplay();
    }
});

// ===== LOAD HISTORY ON START =====
window.addEventListener("load", loadHistory);

// ===== EXPORTS FOR BUTTONS =====
window.appendToDisplay = appendToDisplay;
window.clearDisplay = clearDisplay;
window.calculate = calculate;
window.clearHistory = clearHistory;
window.toggleTheme = toggleTheme;
