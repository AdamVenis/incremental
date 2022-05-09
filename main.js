const mult = 10000; // for testing

const state = {
    money: 0,
    energy: 100,
    begIncome: 0.01,
    upgrades: {},
    unlockedJobs: {},
};

const stats = ["money", "energy", "passiveIncome", "charisma", "education", "fitness", "currentJob"];
for (stat of stats) {
    if (!(stat in state)) {
        state[stat] = 0;
    }
}

const upgradeData = {
    findJar1: {
        displayName: 'Find A Jar',
        toolTip: 'Your begging is more effective (3x $/click)',
        unlocked: state => state.money >= 0.5,
        cost: 0.5,
        buy: state => state.begIncome *= 3
    },
    findSign1: {
        displayName: 'Find A Paper Sign',
        toolTip: 'Generate passive begging income (income +$0.025/s)',
        unlocked: state => state.upgrades.findJar1.researched,
        cost: 1,
        buy: state => state.passiveIncome += 0.0025
    },
    findJar2: {
        displayName: 'Find A Bigger Jar',
        toolTip: 'Your begging is more effective (2x $/click)',
        unlocked: state => state.upgrades.findSign1.researched,
        cost: 3,
        buy: state => state.begIncome *= 2
    },
    findSign2: {
        displayName: 'Buy A Nice Sign',
        toolTip: 'Generate more passive begging income (income +$0.1/s)',
        unlocked: state => state.upgrades.findJar2.researched,
        cost: 10,
        buy: state => state.passiveIncome += 0.01
    },
    seedMoney: {
        displayName: 'Put your own money in the jar',
        toolTip: 'Money in the jar makes people more likely to give (2x $/click)',
        unlocked: state => state.upgrades.findJar2.researched,
        cost: 10,
        buy: state => state.begIncome *= 2
    },
    sobStoby: {
        displayName: 'Sob Story',
        toolTip: 'Write a Sob Story on your nice sign to increase charisma. (Charisma +1)',
        unlocked: state => state.upgrades.findSign2.researched,
        cost: 30,
        buy: state => state.charisma += 1
    },
    cleanClothes: {
        displayName: 'Clean Clothes',
        toolTip: 'Gives you charisma to beg for more money (Charisma +1)',
        unlocked: state => state.upgrades.findSign2.researched,
        cost: 60,
        buy: state => state.charisma += 1
    },
    gymMembership: {
        displayName: 'Gym Membership',
        toolTip: 'Allows you to shower and exercise - greatly improves charisma (Charimsa +3)',
        unlocked: state => state.upgrades.findSign2.researched,
        cost: 30,
        buy: state => {
            state.passiveIncome -= 0.005;
            state.charisma += 3
        }
    },
    phone: {
        displayName: 'Phone',
        toolTip: 'Buy a phone to get connected to the world. (income -0.1/s)',
        unlocked: state => state.upgrades.cleanClothes.researched,
        cost: 150,
        buy: state => {
            state.phone = true;
            state.passiveIncome -= 0.01;
            state.currentJob = null;
        }
    },
    ged: {
        displayName: 'Get your GED (Education +3)',
        toolTip: 'Become educated',
        unlocked: state => state.upgrades.phone.researched,
        cost: 1000,
        buy: state => state.education += 3
    },
}

const jobData = {
    dogWalker: {
        displayName: 'Dog Walker',
        toolTip: 'Pays $6.25/hr',
        requirementsMet: state => state.money >= 150,
        salary: 6.25
    },
    nanny: {
        displayName: 'Nanny',
        toolTip: 'Pays $9.25/hr',
        requirementsMet: state => state.money >= 220,
        salary: 9.25
    },
    handyMan: {
        displayName: 'Handyman',
        toolTip: 'Pays $10.00/hr',
        requirementsMet: state => state.money >= 250,
        salary: 10.00
    },
    // beyond here need GED
    landscaper: {
        displayName: 'Landscaper',
        toolTip: 'Pays $14.76/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 10
        },
        salary: 14.76
    },
    privateInvestigator: {
        displayName: 'Private Investigator',
        toolTip: 'Pays $17.97/hr',
        requirementsMet: state => {
            state.money >= 1000,
            state.education >= 10
        },
        salary: 17.97
    },
    carpenter: {
        displayName: 'Carpenter',
        toolTip: 'Pays $20.73/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 10
        },
        salary: 20.73
    },
    firefighter: {
        displayName: 'Firefighter',
        toolTip: 'Pays $22.14/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 10
        },
        salary: 22.14
    },
    plumber: {
        displayName: 'Plumber',
        toolTip: 'Pays $24.26/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 10
        },
        salary: 24.26
    },
    truckDriver: {
        displayName: 'Truck Driver',
        toolTip: 'Pays $30.45/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 10
        },
        salary: 30.45
    },
    salesman: {
        displayName: 'Sales',
        toolTip: 'Pays $32.96/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 10
            state.charisma >= 10
        },
        salary: 32.96
    },
    // beyond here need bachelors
    humanResources: {
        displayName: 'Human Resources',
        toolTip: 'Pays $35.28/hr',
        requirementsMet: state => {
            state.money >= 500,
            state.education >= 20
            state.charisma >= 10
        },
        salary: 35.28
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
        button.title = upgradeData[name].toolTip + "\nCost: $" + upgradeData[name].cost;
        adventure.appendChild(button);
    }

    for (let i = 0; i < stats.length; i++) {
        const div = document.createElement("div");
        div.id = stats[i];
        adventure.insertBefore(div, adventure.children[i]);
    }

    const unlockJobsDiv = document.getElementById("unlockableJobs");
    for (const jobName in jobData) {
        const unlockJobDiv = document.createElement("button");
        unlockJobDiv.id = "unlock-" + jobName;
        unlockJobDiv.innerText = jobData[jobName].displayName;
        let jobNameCopy = jobName.slice();
        unlockJobDiv.onclick = () => unlockJob(jobName);
        unlockJobDiv.style.display = "block";
        unlockJobsDiv.appendChild(unlockJobDiv);
    }

    const selectJobsDiv = document.getElementById("selectableJobs");
    for (const jobName in jobData) {
        const selectJobDiv = document.createElement("button");
        selectJobDiv.id = "select-" + jobName;
        selectJobDiv.innerText = jobData[jobName].displayName;
        selectJobDiv.onclick = () => selectJob(jobName);
        selectJobDiv.style.display = "none";
        selectJobsDiv.appendChild(selectJobDiv);
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
    for (stat of ["charisma", "education", "fitness"]) {
        if (stat in state && state[stat] != 0) {
            document.getElementById(stat).innerText = capitalizeFirstLetter(stat) + ": " + state[stat];          
        }
    }
    if ('currentJob' in state) {
        document.getElementById('jobslink').style.display = '';
        if (state.currentJob in jobData) {
            const jobName = jobData[state.currentJob].displayName;
            document.getElementById('currentJob').innerText = "Current Job: " + jobName;   
        }
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

    // const jobsDiv = document.getElementById("unlockableJobs");
    for (jobName in jobData) {
        jobUnlock = document.getElementById("unlock-" + jobName);
        jobUnlock.disabled = !jobData[jobName].requirementsMet(state);
    }
}

function step() {
    updateState();
    render();
}

function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
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

function unlockJob(name) {
    const unlockJobDiv = document.getElementById("unlock-" + name);
    unlockJobDiv.style.display = "none";
    state.unlockedJobs[name] = true;
    document.getElementById("select-" + name).style.display = 'block';
}

function selectJob(name) {
    state.currentJob = name;
}

init();
var cancel = setInterval(step, 100);
