// #file
const { prompt } = require('../Utils/PromptSingleton.js');
const Combat = require("./Combat.js");

class Character {
    constructor(data) {
        // Initialize character properties from data
        this.class = data.class;
        this.name = data.name;
        this.str = data.str;
        this.agi = data.agi;
        this.int = data.int;
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.armor = data.armor;
        this.damage = data.damage;
        this.inventory = data.inventory;
        this.money = data.money;
    }

    // Adds an item to the character's inventory
    addItem(itemId) {
        this.inventory.push(itemId);
    }

    // Removes an item from the inventory
    removeItem(itemId) {
        const index = this.inventory.indexOf(itemId);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }

    // Checks if the character has a specific item
    hasItem(itemId) {
        return this.inventory.includes(itemId);
    }

    // Getters for character properties
    getName() { return this.name; }
    getClass() { return this.class; }
    getStr() { return this.str; }
    getAgi() { return this.agi; }
    getInt() { return this.int; }
    getHealth() { return this.health; }
    getMaxHealth() { return this.maxHealth; }
    getArmor() { return this.armor; }
    getDamage() { return this.damage; }
    getInventory() { return this.inventory; }
    getMoney() { return this.money; }

    // Performs an attribute check and handles the outcome
    performAttributeCheck(attribute, difficulty, choice, items, npcs, startEncounter, prompt, encounter, encounterId) {
        const itemBonus = this.inventory.reduce((total, itemId) => {
            const item = items.find(item => item.id === itemId);
            return item && item.bonusType === attribute ? total + item.bonusAmount : total;
        }, 0);

        const roll = Math.floor(Math.random() * 15) + 1;
        const totalAttribute = this[attribute] + itemBonus;
        const total = roll + totalAttribute;
        const success = total >= difficulty;

        console.log(`You rolled a ${roll} + ${totalAttribute} (${attribute.toUpperCase()} including item bonuses) = ${total}`);

        if (success) {
            console.log(choice.success.text);
            if (choice.success.immediateEffect) {
                choice.success.immediateEffect(this);
            }
        } else {
            if(choice.failure) {
                console.log(choice.failure.text);
                if (choice.failure.immediateEffect) {
                    choice.failure.immediateEffect(this);
                }
                if (choice.failure.effect === "enterCombat") {
                    let npcId = choice.failure.npcid;
                    let nextEncounterId = choice.nextEncounterId;
                    Combat.enterCombat(this, npcId, npcs, startEncounter, this.useItem.bind(this), prompt, nextEncounterId, encounter);
                }
            }
        }
        return success;
    }

    // Handles the intermission between encounters
    pauseForIntermission(items, nextEncounterId, startEncounter, useItem, prompt, encounter) {
        console.log("\nIntermission:");
        console.log("1. View character status");
        console.log("2. Use an item");
        console.log("3. Continue");

        let choice = prompt("Choose an option: ");
        switch (choice) {
            case "1":
                console.clear();
                console.log(`Character Status:\nName: ${this.name}\nHealth: ${this.health}\nSTR: ${this.str}, AGI: ${this.agi}, INT: ${this.int}\nMoney: ${this.money}\nInventory: ${this.inventory.map(id => items.find(item => item.id === id).name).join(", ") || "No items"}`);
                this.pauseForIntermission(items, nextEncounterId, startEncounter, useItem, prompt, encounter);
                break;
            case "2":
                const consumables = this.inventory.map(id => items.find(item => item.id === id)).filter(item => item.type === "consumable");
                if (consumables.length === 0) {
                    console.log("No items to use.");
                    this.pauseForIntermission(items, nextEncounterId, startEncounter, useItem, prompt, encounter);
                } else {
                    useItem(items, this.applyItemEffect.bind(this), this.pauseForIntermission.bind(this), prompt, encounter, nextEncounterId, startEncounter);
                }
                break;
            case "3":
                nextEncounterId = encounter.getNextEncounterId();
                if (nextEncounterId){
                    startEncounter(nextEncounterId, this);
                } else {
                    console.log("No next encounter. The game will now exit");
                    process.exit(0);
                }
                break;
            default:
                console.log("Invalid option. Please try again.");
                this.pauseForIntermission(items, nextEncounterId, startEncounter, useItem, prompt, encounter);
        }
    }

    // Handles using an item from the inventory
    useItem(items, applyItemEffect, pauseForIntermission, prompt, encounter, nextEncounterId, startEncounter) {
        const consumables = this.inventory.map(id => items.find(item => item.id === id)).filter(item => item.type === "consumable");

        if (consumables.length === 0) {
            console.log("You have no consumable items to use.");
            pauseForIntermission(items, nextEncounterId, startEncounter, this, prompt, encounter);
            return;
        }

        console.log("Select an item to use:");
        consumables.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} (${item.effect}, ${item.amount})`);
        });
        console.log(`${consumables.length + 1}. Go back`);

        let choice = prompt("Choose an option: ");
        if (choice === consumables.length + 1) {
            pauseForIntermission(items, nextEncounterId, startEncounter, useItem, prompt, encounter);
            return;
        }
        const selectedItem = consumables[choice - 1];
        if (selectedItem) {
            this.applyItemEffect(this, selectedItem);
        } else {
            console.log("Invalid choice. Please try again.");
        }
        pauseForIntermission(items, nextEncounterId, startEncounter, this.useItem.bind(this), prompt, encounter);
    }
    // Handles looting an NPC after combat
    handleLoot(npc, items) {
        console.log(`Defeated ${npc.name}. Looting...`);
        this.money += npc.money;

        npc.inventory.forEach((itemId) => {
            const newItem = items.find(item => item.id === itemId);
            if (!newItem) {
                console.log("Item not found.");
                return;
            }

            console.log(`Adding ${newItem.name} to your inventory.`);
            this.addItem(newItem.id);
        });
    }
    // Applies the effect of an item
    applyItemEffect(character, item) {
        switch(item.effect) {
            case "heal":
                character.health = Math.min(character.health + item.amount, character.maxHealth);
                console.log(`Used ${item.name}. Healed for ${item.amount} health. Current health: ${character.health}.`);

                const itemIndex = character.inventory.indexOf(item.id);
                if (itemIndex !== -1) {
                    character.inventory.splice(itemIndex, 1); // Remove the item by its index
                    console.log(`${item.name} has been removed from your inventory.`);
                } else {
                    console.log("Error: Item was used but not found in inventory.");
                }
        }
    }
}

module.exports = Character;
