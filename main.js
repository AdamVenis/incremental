const mult = 10; // for testing

const state = {
    money: 0,
    energy: 100,
    charisma: 0,
    day: 0,
    begIncome: 0.03,
    passiveIncome: 0.0,
    upgrades: {},
};

const upgradeData = {
    findSign: {
        displayName: 'Find A Sign',
        unlocked: state => state.money >= 0.5,
        cost: 0.5,
        buy: state => state.begIncome *= 3
    },
    findJar: {
        displayName: 'Find a Jar',
        unlocked: state => state.upgrades.cleanClothes.researched,
        cost: 50,
        buy: state => state.passiveIncome += 1
    },
    cleanClothes: {
        displayName: 'Clean Clothes',
        unlocked: state => state.money >= 15,
        cost: 25,
        buy: state => state.charisma += 1
    },
}

// add upgrades to state
for (const name in upgradeData) {
    state.upgrades[name] = {
        unlocked: false,
        researched: false
    };
}

function init() {
    const adventure = document.getElementById("Adventure");
    for (const name in upgradeData) {
        const button = document.createElement("button");
        const displayText = document.createTextNode(upgradeData[name].displayName);
        button.appendChild(displayText);
        button.id = name;
        button.style="display: none;"
        button.onclick = () => research(name);
        adventure.appendChild(button);
    }

    const stats = ["money", "energy", "charisma"];
    for (let i = 0; i < stats.length; i++) {
        const div = document.createElement("div");
        div.id = stats[i];
        adventure.insertBefore(div, adventure.children[i]);
    }
}

function updateState() {
    state.money += mult * state.passiveIncome * (1 + state.charisma);
    state.energy -= mult * 0.01; 
}

function render() {
    const adventure = document.getElementById("Adventure");

    document.getElementById("money").innerText = "Current Money: $" + round(state.money, 2);
    document.getElementById("energy").innerText = "Current Energy: " + round(state.energy, 1);
    if (state.charisma > 0) {
        document.getElementById('charisma').innerText = "Charisma: " + state.charisma;   
    }

    for (const name in upgradeData) {
        if (state.upgrades[name].researched) {
            continue;
        } 
        if (upgradeData[name].unlocked(state)) {
            document.getElementById(name).style = "";
            document.getElementById(name).disabled = state.money < upgradeData[name].cost;
        }
    }
}

function step() {
    updateState();
    render();
}

function round(x, d) {
    return Math.round(x * 10**d) / 10**d;
}

function beg() {
    state.money += mult * state.begIncome;
}

function eatFood() {
    state.energy += 10;
    state.money -= 10;
}

function research(name) {
    state.money -= upgradeData[name].cost;
    upgradeData[name].buy(state);
    document.getElementById(name).style.display = "none";
    state.upgrades[name].researched = true;

    const text = document.createTextNode(upgradeData[name].displayName + '\n');
    document.getElementById('researched').appendChild(text);
}

init();
var cancel = setInterval(step, 100);
