const prompt = require("prompt-sync")();
const { characters } = require("./characters.js");
const { items } = require("./items.js");
const { encounters } = require("./encounters.js");
const { npcs } = require("./npcs.js");

function performAttributeCheck(attribute, character, difficulty) {
    const itemBonus = character.inventory.reduce((total, itemId) => {
        const item = items.find((item) => item.id === itemId);
        return item && item.bonusType === attribute
            ? total + item.bonusAmount
            : total;
    }, 0);

    const roll = Math.floor(Math.random() * 15) + 1;
    const totalAttribute = character[attribute] + itemBonus;
    const total = roll + totalAttribute;
    const success = total >= difficulty;

    console.log(
        `You rolled a ${roll} + ${totalAttribute} (${attribute.toUpperCase()} including item bonuses) = ${total}`
    );

    if (success) {
        console.log("\x1b[32m%s\x1b[0m", "PASS");
    } else {
        console.log("\x1b[31m%s\x1b[0m", "FAIL");
    }

    return success;
}

function selectCharacter() {
    console.log("Select your character:");
    characters.forEach((char, index) => {
        console.log(
            `${index + 1}: ${char.name} (Class: ${char.class}, STR ${
                char.str
            }, AGI ${char.agi}, INT ${char.int}, Health ${char.health})`
        );
    });

    let index =
        parseInt(prompt("Enter the number of your character: "), 10) - 1;
    while (index < 0 || index >= characters.length) {
        console.log("Invalid selection, please try again.");
        index =
            parseInt(prompt("Enter the number of your character: "), 10) - 1;
    }
    return characters[index];
}

function selectStartingItem(character) {
    console.log("Select a starting item:");
    items
        .filter((item) => item.starterItem)
        .forEach((item, index) => {
            console.log(
                `${index + 1}: ${
                    item.name
                } (Bonus: ${item.bonusType.toUpperCase()} +${
                    item.bonusAmount
                }, Value: ${item.value})`
            );
        });

    let index = parseInt(prompt("Enter the number of your item: "), 10) - 1;
    const filteredItems = items.filter((item) => item.starterItem);
    if (index < 0 || index >= filteredItems.length) {
        console.log("Invalid selection, please try again.");
        return selectStartingItem(character);
    }
    character.inventory.push(filteredItems[index].id);
}

function calculateDamage(source, target) {
    // console.log("Calculating Damage For:", source.name); // Debugging log
    const weapon = source.inventory
        .map((itemId) => items.find((item) => item.id === itemId))
        .find(
            (item) => item && ["melee", "ranged", "hacking"].includes(item.type)
        );

    let baseDamage = source.str; // Start with character's strength
    // console.log("Base Damage:", baseDamage); // Debugging log

    if (weapon) {
        // console.log(`Using weapon: ${weapon.name}, Damage: ${weapon.damage}`); // Debugging log
        baseDamage += weapon.damage;
    }

    const totalArmor = target.inventory.reduce((total, itemId) => {
        const item = items.find(
            (item) => item.id === itemId && item.type === "armor"
        );
        return total + (item ? item.bonusAmount : 0);
    }, target.armor || 0); // Ensure target.armor is a number

    // console.log("Total Armor:", totalArmor); // Debugging log

    const finalDamage = Math.max(0, baseDamage - totalArmor);
    // console.log("Final Damage:", finalDamage); // Debugging log

    return finalDamage;
}

function enterCombat(player, npcId) {
    console.log("You enter combat.");
    resolveCombat(player, npcId);
}

function resolveCombat(player, npcId) {
    const npc = npcs.find((n) => n.id === npcId);
    if (!npc) {
        console.log("NPC not found, cannot initiate combat.");
        return;
    }

    let combatActive = true;

    while (combatActive) {
        console.log(`Entering combat with ${npc.name}...`);
        const playerDamage = calculateDamage(player, npc);
        npc.health -= playerDamage;
        console.log(
            `${npc.name} takes ${playerDamage} damage, remaining health: ${npc.health}.`
        );

        if (npc.health <= 0) {
            console.log(`${npc.name} defeated!`);
            combatActive = false;
            continue; // Proceed to the next iteration or end combat
        }

        // NPC's turn to attack
        const npcDamage = calculateDamage(npc, player);
        player.health -= npcDamage;
        console.log(
            `${player.name} takes ${npcDamage} damage, remaining health: ${player.health}.`
        );

        if (player.health <= 0) {
            console.log(`${player.name} has been defeated. Game Over.`);
            combatActive = false;
            continue;
        }

        // After each round, ask the player if they want to continue or flee
        const action = prompt(
            "Do you wish to 'continue' fighting or 'flee'? "
        ).toLowerCase();
        if (action === "flee") {
            console.log("You decided to flee. Returning to the encounter...");
            combatActive = false;
            startEncounter(npcId, player); // Assuming you might want to restart the same encounter
        }
    }
}

function startEncounter(encounterId, character) {
    const encounter = encounters.find((e) => e.id === encounterId);
    if (!encounter) {
        console.log("Encounter not found.");
        return;
    }

    console.log(encounter.text);
    encounter.choices.forEach((choice, index) => {
        console.log(`${index + 1}: ${choice.text}`);
    });

    let answer, choice;
    while (true) {
        answer = parseInt(prompt("Choose an action: "), 10) - 1;
        choice = encounter.choices[answer];

        if (!choice) {
            console.log("Invalid choice. Please try again.");
            continue; // This will loop back and ask again
        } else {
            break; // Break the loop if a valid choice is made
        }
    }

    const success = performAttributeCheck(
        choice.attribute,
        character,
        choice.difficulty
    );

    if (success) {
        console.log(choice.success.text);
        if (typeof choice.success.effect === "function")
            choice.success.effect();
    } else {
        console.log(choice.failure.text);
        if (choice.failure.effect === "enterCombat") {
            enterCombat(character, 1); // Assuming combat is always against the same NPC, adjust as needed
        }
    }
}

function startGame() {
    console.log("Welcome to the RPG game!");
    const selectedCharacter = selectCharacter();
    console.log(
        `You have selected ${selectedCharacter.name}, the ${selectedCharacter.class}.`
    );

    selectStartingItem(selectedCharacter);
    startEncounter(1, selectedCharacter);
}

startGame();
