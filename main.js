var seconds = 0;
var dt = 300;

const state = {
	money: 0,
	energy: 100,
	day: 0,
	income: 0.001,
	upgrades: {
		doubleIncome: {
			unlocked: false,
			researched: false
		}
	},
};

var upgradeData = {
	doubleIncome: {
		unlocked: state => state.money >= 5,
		cost: 5,
		buy: state => {
			state.income *= 10;
		}
	}
}

function step() {
    state.money += dt * state.income;
    money = Math.round(state.money * 100) / 100;
    document.getElementById('money').innerText = "Current Money: $" + money;

    state.energy -= dt * 0.01; 
    energy = Math.round(state.energy * 10) / 10;
    document.getElementById('energy').innerText = "Current Energy: " + energy;

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

var cancel = setInterval(step, 100);
