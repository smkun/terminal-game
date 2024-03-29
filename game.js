const prompt = require("prompt-sync")();
const { characters } = require("./characters.js");
const { items, addItemToCharacter } = require("./items.js");
const { encounters } = require("./encounters.js");
const { npcs } = require("./npcs.js");
const { displayIntro } = require("./intro.js");

function selectCharacter() {
    console.clear();
    console.log("Select your character:");
    characters.forEach((char, index) => {
        console.log(
            `${index + 1}: ${char.name} (Class: ${char.class}, STR ${
                char.str
            }, AGI ${char.agi}, INT ${char.int}, Health ${char.health})`
        );
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
    selectedCharacter.maxHealth = selectedCharacter.health;
    return characters[index];
}

function selectStartingItem(character) {
    console.clear();
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

function startEncounter(encounterId, character) {
    console.clear();
    const encounter = encounters.find((e) => e.encounterId === encounterId);
    if (!encounter) {
        console.log("Encounter not found.");
        return;
    }

    console.log(encounter.text);

    let choice;
    while (true) {
        encounter.choices.forEach((choice, index) => {
            console.log(`${index + 1}: ${choice.text}`);
        });

        let answer = parseInt(prompt("Choose an action: "), 10) - 1;
        choice = encounter.choices[answer];

        if (!choice) {
            console.log("Invalid choice. Please try again.");
            continue; // Loop until a valid choice is made
        }
        break; // Exit loop on valid choice
    }

    const success = performAttributeCheck(
        choice.attribute,
        character,
        choice.difficulty
    );
    if (success) {
        console.log(choice.success.text);
        if (typeof choice.success.effect === "function") {
            choice.success.effect();
        }
        pauseForIntermission(character);
        // Transition to the next encounter if available
        if (encounter.nextEncounterId) {
            startEncounter(encounter.nextEncounterId, character);
        }
    } else {
        console.log(choice.failure.text);
        // Trigger combat or execute failure effect
        if (choice.failure.effect === "enterCombat" && choice.failure.npcid) {
            enterCombat(character, choice.failure.npcid, encounterId);
        } else if (typeof choice.failure.effect === "function") {
            choice.failure.effect();
        }
    }
}

function calculateDamage(source, target) {
    const weapon = source.inventory
        .map((itemId) => items.find((item) => item.id === itemId))
        .find(
            (item) =>
                item &&
                (item.type === "melee" ||
                    item.type === "ranged" ||
                    item.type === "hacking")
        );
    let attackType = weapon ? weapon.type : "melee"; // Default to melee if no weapon
    let baseStat = source.str; // Default stat to use for damage calculation
    if (attackType === "ranged") {
        baseStat = source.agi;
    } else if (attackType === "hacking") {
        baseStat = source.int;
    }

    // Calculate the base damage. For characters, include a random value within their damage range.
    let baseDamage = baseStat;
    if ("damage" in source) {
        baseDamage += Math.floor(Math.random() * source.damage) + 1; // Only for characters
    }

    // Include weapon damage if applicable
    if (weapon) {
        baseDamage += weapon.damage;
    }

    // Calculate total armor value of the target
    const totalArmor = target.inventory.reduce((total, itemId) => {
        const item = items.find(
            (item) => item.id === itemId && item.type === "armor"
        );
        return total + (item ? item.bonusAmount : 0);
    }, target.armor || 0); // Ensure there's a fallback for target.armor

    // Calculate the final damage
    const finalDamage = Math.max(0, baseDamage - totalArmor);
    return finalDamage;
}

function enterCombat(player, npcId, currentEncounterId) {
    console.log("You enter combat.");
    resolveCombat(player, npcId, currentEncounterId);
}

function resolveCombat(player, npcId, currentEncounterId) {
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
            handleLoot(player, npc, currentEncounterId);
            break; // Exiting the loop after handling loot
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
            startEncounter(npcId, player);
        }
    }
}

function handleLoot(player, npc, currentEncounterId) {
    console.log(`Defeated ${npc.name}. Looting...`);
    player.money += npc.money;

    npc.inventory.forEach((itemId) => {
        const newItem = items.find((item) => item.id === itemId);
        if (!newItem) {
            console.log("Item not found.");
            return;
        }

        console.log(`Adding ${newItem.name} to your inventory.`);

        addItemToCharacter(player, newItem.id);
    });
    pauseForIntermission(player);
    const currentEncounter = encounters.find(
        (enc) => enc.encounterId === currentEncounterId
    );
    if (currentEncounter && currentEncounter.nextEncounterId) {
        startEncounter(currentEncounter.nextEncounterId, player);
    } else {
        console.log("No more encounters or next encounter not found.");
    }
}

function startGame() {
    displayIntro();
    const selectedCharacter = selectCharacter();
    console.log(
        `You have selected ${selectedCharacter.name}, the ${selectedCharacter.class}.`
    );

    selectStartingItem(selectedCharacter);
    startEncounter(1, selectedCharacter);
}

function pauseForIntermission(character) {
    console.log("\nIntermission:");
    console.log("1. View character status");
    console.log("2. Use an item");
    console.log("3. Continue");

    let choice = prompt("Choose an option: ");
    switch (choice) {
        case "1":
            console.clear();
            console.log(
                `Character Status:\nName: ${character.name}\nHealth: ${
                    character.health
                }\nSTR: ${character.str}, AGI: ${character.agi}, INT: ${
                    character.int
                }\nMoney: ${character.money}\nInventory: ${
                    character.inventory
                        .map((id) => items.find((item) => item.id === id).name)
                        .join(", ") || "No items"
                }`
            );
            pauseForIntermission(character); // Recursively call to allow another choice
            break;
        case "2":
            if (character.inventory.length === 0) {
                console.log("No items to use.");
                pauseForIntermission(character); // Recursively call to allow another choice
            } else {
                useItem(character);
            }
            break;
        case "3":
            console.log("Continuing...");
            break; // Exit the intermission
        default:
            console.log("Invalid option. Please try again.");
            pauseForIntermission(character); // Call for valid input
    }
}

function useItem(character) {
    // Filter consumable items from the character's inventory
    const consumables = character.inventory.map(id => items.find(item => item.id === id)).filter(item => item.type === "consumable");

    if (consumables.length === 0) {
        console.log("You have no consumable items to use.");
        pauseForIntermission(character);
        return;
    }

    console.log("Select an item to use:");
    consumables.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.effect}, ${item.amount})`);
    });
    console.log(`${consumables.length + 1}. Go back`);

    let choice = parseInt(prompt("Choose an option: "), 10);
    if (choice === consumables.length + 1) {
        pauseForIntermission(character);
        return;
    }

    const selectedItem = consumables[choice - 1];
    if (selectedItem) {
        applyItemEffect(character, selectedItem);
        console.log(`Used ${selectedItem.name}.`);
    } else {
        console.log("Invalid choice. Please try again.");
    }

    pauseForIntermission(character);
}

function applyItemEffect(character, item) {
    switch(item.effect) {
        case "heal":
            character.health = Math.min(character.health + item.amount, character.maxHealth);
            console.log(`Healed for ${item.amount} health. Current health: ${character.health}.`);
            break;
        // Add cases for other effects as needed
    }
}

startGame();
