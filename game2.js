// #file
// Imports and Constants
const { prompt } = require("./Utils/PromptSingleton.js");
const charactersData = require("./Data/characters.js").characters;
const itemsData = require("./Data/items.js").items;
const encountersData = require("./Data/encounters.js").encounters;
const npcsData = require("./Data/npcs.js").npcs;
const { displayIntro } = require("./Data/intro.js");
const Combat = require("./Classes/Combat.js");


const Character = require("./Classes/Characters.js");
const {Encounter, Choice} = require("./Classes/Encounters.js");
const Item = require("./Classes/Items.js");
const Npc = require("./Classes/Npcs.js");

// Create instances of the classes using the data
const characters = charactersData.map(data => new Character(data));
const items = itemsData.map(data => new Item(data));
const encounters = encountersData.map(data => {
    const choices = data.choices.map(choiceData => new Choice(choiceData));
    return new Encounter({ ...data, choices });
});
const npcs = npcsData.map(data => new Npc(data));

const selectCharacter = () => {
    console.clear();
    console.log("Select your character:");
    characters.forEach((char, index) => {
        console.log(`${index + 1}: ${char.getName()} (Class: ${char.getClass()}, STR ${char.getStr()}, AGI ${char.getAgi()}, INT ${char.getInt()}, Health ${char.getHealth()})`);
    });

    let isValidEntry = false;
    let index;
    while (!isValidEntry) {
        const input = prompt("Enter the number of your character: ");
        index = parseInt(input, 10) - 1;

        if (!isNaN(index) && index >= 0 && index < characters.length) {
            isValidEntry = true;
        } else {
            console.log("Invalid selection, please try again.");
        }
    }
    return characters[index];
};

// Display starting item selection
const selectStartingItem = (character) => {
    console.clear();
    console.log("Select a starting item:");
    const starterItems = items.filter(item => item.isStarterItem());
    starterItems.forEach((item, index) => {
        console.log(`${index + 1}: ${item.getName()} (Bonus: ${item.getBonusType().toUpperCase()} +${item.getBonusAmount()}, Value: ${item.getValue()})`);
    });

    let index = parseInt(prompt("Enter the number of your item: "), 10) - 1;
    if (index < 0 || index >= starterItems.length) {
        console.log("Invalid selection, please try again.");
        return selectStartingItem(character);
    }
    character.addItem(starterItems[index].getId());
};

// Initiates an encounter based on the encounterId
const startEncounter = (encounterId, character) => {
    // console.log("DEBUG67", character)
    console.clear();
    const encounter = encounters.find(e => e.getEncounterId() === encounterId);
    if (!encounter) {
        console.log("Encounter with id ${encounterId} not found.");
        return;
    }
    // console.log("DEBUG73 game2.js", encounter);
    console.log(encounter.getText());
    let choice;
    while (true) {
        encounter.getChoices().forEach((choice, index) => {
            console.log(`${index + 1}: ${choice.getText()}`);
        });

        let answer = parseInt(prompt("Choose an action: "), 10) - 1;
        choice = encounter.getChoice(answer);
        // console.log("????");
        // console.log("DEBUG84", choice);
        // console.log("!!!!!");
        if (!choice) {
            console.log("Invalid choice. Please try again.");
            continue;
        }
        break;
    }
    // console.log("DEBUG93 game.js", encounter)
    const success = character.performAttributeCheck(choice.getAttribute(), choice.getDifficulty(), choice, items, npcs, startEncounter, prompt, encounter);
    
    // console.log("????");
    // console.log("DEBUG92", success);
    // console.log("!!!!!");
    let nextEncounterId = encounter.getNextEncounterId();
    if (success) {
        encounter.executeImmediateEffect(choice, character);
        encounter.executeEffect(choice);
        nextEncounterId = encounter.getNextEncounterId();
        character.pauseForIntermission(items, nextEncounterId, startEncounter, character.useItem.bind(character, items), prompt, encounter);
        if (nextEncounterId) {
        }
    } else {
        if (choice.failure) {
            console.log(choice.failure.text);
            // console.log("DEBUG101 game2.js", encounter);
            if (choice.failure && choice.failure.effect === "enterCombat" && choice.failure.npcId) {
                const nextEncounter = encounters.find(e => e.getEncounterId() === nextEncounterId);
                nextEncounterId = enterCombat(character, choice.failure.npcId, nextEncounterId, encounter);
            } else if (typeof choice.failure.effect === "function") {
                choice.failure.effect();
            }
        }
    };
}

const enterCombat = (character, npcId, nextEncounterId, encounter) => {
    // console.log("DEBUG114 game2.js", encounter);
    const npc = npcs.find(n => n.id === npcId);
    const combat = new Combat(character, npc);
    combat.enterCombat(character, npc, startEncounter, character.useItem.bind(character, items), prompt, nextEncounterId, encounter);
    combat.resolveCombat(startEncounter, character.useItem.bind(character, items), prompt, nextEncounterId, encounter);
    return nextEncounterId;
};
// Game Start Function
const startGame = () => {
    displayIntro();
    const selectedCharacter = selectCharacter();
    console.log(`You have selected ${selectedCharacter.getName()}, the ${selectedCharacter.getClass()}.`);

    selectStartingItem(selectedCharacter);
    startEncounter(1, selectedCharacter);
};

startGame();