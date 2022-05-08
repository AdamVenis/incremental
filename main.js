const mult = 1000; // for testing

const state = {
    money: 0,
    energy: 100,
    charisma: 0,
    day: 0,
    begIncome: 0.01,
    passiveIncome: 0.0,
    upgrades: {},
};

const stats = ["money", "energy", "passiveIncome", "charisma", "job"];

const upgradeData = {
    findJar1: {
        displayName: 'Find A Jar',
        toolTip: 'Your begging is three times as effective',
        unlocked: state => state.money >= 0.5,
        cost: 0.5,
        buy: state => state.begIncome *= 3
    },
    findSign1: {
        displayName: 'Find A Paper Sign',
        toolTip: 'Generate passive begging income',
        unlocked: state => state.upgrades.findJar1.researched,
        cost: 1,
        buy: state => state.passiveIncome += 0.0025
    },
    findJar2: {
        displayName: 'Find A Bigger Jar',
        toolTip: 'Your begging is twice as effective',
        unlocked: state => state.upgrades.findSign1.researched,
        cost: 3,
        buy: state => state.begIncome *= 2
    },
    findSign2: {
        displayName: 'Buy A Nice Sign',
        toolTip: 'Generate more passive begging income',
        unlocked: state => state.upgrades.findJar2.researched,
        cost: 10,
        buy: state => state.passiveIncome += 0.01
    },
    seedMoney: {
        displayName: 'Put your own money in the jar',
        toolTip: 'Money in the jar makes people more likely to give',
        unlocked: state => state.upgrades.findJar2.researched,
        cost: 10,
        buy: state => state.begIncome *= 2
    },
    sobStoby: {
        displayName: 'Sob Story',
        toolTip: 'Write a Sob Story on your nice sign to increase charisma',
        unlocked: state => state.upgrades.findSign2.researched,
        cost: 30,
        buy: state => state.charisma += 1
    },
    cleanClothes: {
        displayName: 'Clean Clothes',
        toolTip: 'Gives you charisma to beg for more money',
        unlocked: state => state.upgrades.findSign2.researched,
        cost: 60,
        buy: state => state.charisma += 1
    },
    gymMembership: {
        displayName: 'Gym Membership',
        toolTip: 'Allows you to shower and exercise - greatly improves charisma',
        unlocked: state => state.upgrades.findSign2.researched,
        cost: 30,
        buy: state => {
            state.passiveIncome -= 0.005;
            state.charisma += 3
        }
    },
    phone: {
        displayName: 'Phone',
        toolTip: 'Buy a phone to get connected to the world',
        unlocked: state => state.upgrades.cleanClothes.researched,
        cost: 150,
        buy: state => {
            state.phone = true;
            state.passiveIncome -= 0.02;
            state.job = null;
        }
    },
    ged: {
        displayName: 'GED',
        toolTip: 'Pays $10.00/hr',
        unlocked: state => state.upgrades.phone.researched,
        cost: 250,
        buy: state => {
            state.job = 'handyMan';
            state.begIncome = 10.00;
        }
    },
}

const jobData = {
    dogWalker: {
        displayName: 'Get A Job: Dog Walker',
        toolTip: 'Pays $6.25/hr',
        unlocked: state => state.upgrades.phone.researched,
        cost: 150,
        salary: 6.25
    },
    nanny: {
        displayName: 'Get A Job: Nanny',
        toolTip: 'Pays $9.25/hr',
        unlocked: state => state.upgrades.phone.researched,
        cost: 220,
        salary: 9.25
    },
    handyMan: {
        displayName: 'Get A Job: Handyman',
        toolTip: 'Pays $10.00/hr',
        unlocked: state => state.upgrades.phone.researched,
        cost: 250,
        salary = 10.00
    }
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
        button.title = upgradeData[name].toolTip;
        adventure.appendChild(button);
    }

    for (let i = 0; i < stats.length; i++) {
        const div = document.createElement("div");
        div.id = stats[i];
        adventure.insertBefore(div, adventure.children[i]);
    }
}

function updateState() {
    state.money += mult * state.passiveIncome * (1 + state.charisma) * state.energy / 100;
    state.energy = Math.max(10, state.energy - mult * 0.005); 
}

function render() {
    const adventure = document.getElementById("Adventure");

    document.getElementById("money").innerText = "Current Money: $" + round(state.money, 2);
    document.getElementById("energy").innerText = "Current Energy: " + round(state.energy, 1) + "%";
    if (state.passiveIncome != 0) {
        document.getElementById('passiveIncome').innerText = "Passive Income: " + round(state.passiveIncome, 3) + "/s";      
    }
    if (state.charisma > 0) {
        document.getElementById('charisma').innerText = "Charisma: " + state.charisma;   
    }
    if ('job' in state) {
        document.getElementById('Jobs').style.display = '';
    }

    for (const name in upgradeData) {
        if (state.upgrades[name].researched) {
            continue;
        } 
        if (upgradeData[name].unlocked(state)) {
            state.upgrades[name].unlocked = true;
        }
        if (state.upgrades[name].unlocked) {
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
    state.money += mult * state.begIncome * state.energy / 100;
}

function eatFood() {
    state.energy = Math.min(100, state.energy + 10 * mult);
    state.money -= 3;
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
