var dt = 300;

const state = {
	money: 0,
	energy: 100,
	charisma: 0,
	day: 0,
	income: 0.001,
	upgrades: {},
};

var upgradeData = {
	doubleIncome: {
		displayName: 'Double Income',
		unlocked: state => state.money >= 5,
		cost: 5,
		buy: state => {
			state.income *= 10;
		}
	},
	cleanClothes: {
		displayName: 'Clean Clothes',
		unlocked: state => state.money >= 15,
		cost: 25,
		buy: state => state.charisma += 1
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
		adventure.appendChild(button);
	}
}

function step() {
    state.money += dt * state.income * (1 + state.charisma);
    state.energy -= dt * 0.01; 

    money = Math.round(state.money * 100) / 100;
    document.getElementById('money').innerText = "Current Money: $" + money;
    energy = Math.round(state.energy * 10) / 10;
    document.getElementById('energy').innerText = "Current Energy: " + energy;
    document.getElementById('charisma').innerText = "Charisma: " + state.charisma;

    for (const name in upgradeData) {
		if (!state.upgrades[name].researched && upgradeData[name].unlocked(state)) {
			document.getElementById(name).style = "";
		}
    }
}

function clickSignButton() {
    state.money += 100;
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
}

init();
var cancel = setInterval(step, 100);
