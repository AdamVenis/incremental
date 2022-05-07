var seconds = 0;
var money = document.getElementById('money');
var energy = document.getElementById('energy');

var moneyValue = 0;
var energyValue = 100;
var day = 0;
var income = 0.001;
var dt = 100;

var doubleIncomeConsumed = 0;

function step() {
    moneyValue += dt * income;
    moneyDisplay = Math.round(moneyValue * 100) / 100;
    money.innerText = "Current  Money: $" + moneyDisplay;

    energyValue -= dt * 0.01; 
    energyDisplay = Math.round(energyValue * 10) / 10;
    energy.innerText = "Current energy: " + energyDisplay;

    if (moneyValue >= 5 && doubleIncomeConsumed == 0) {
        document.getElementById("doubleIncome").style = "";
    }
}

function clickSignButton() {
    moneyValue += 100;
}

function eatFood() {
    energyValue += 10;
    moneyValue -= 10;
}

function doubleIncome() {
    if (moneyValue < 5) {
        return;
    }
    moneyValue -= 5;
    income *= 2;
    doubleIncomeConsumed = 1;
    document.getElementById("doubleIncome").style = "display: none;";
}

var cancel = setInterval(step, 100);