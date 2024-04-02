// #file
//
// Classes/Combat.js
const { prompt } = require('../Utils/PromptSingleton.js');
const npcs = require("../Data/npcs.js").npcs;
const items = require("../Data/items.js").items;

// ...

class Combat {
    constructor(character, npc) {
        this.character = character;
        this.npc = npc;
    }
    static enterCombat(character, npcId, npcs, startEncounter, useItem, prompt, nextEncounterId, encounter) {
        // console.log("DEBUG16 Combat.js", encounter);
        const npc = npcs.find(n => n.id === npcId);
        const combat = new Combat(character, npc);
        combat.enterCombat(character, npc, startEncounter, useItem, prompt, nextEncounterId, encounter);
    }

    enterCombat(character, npc, startEncounter, useItem, prompt, nextEncounterId, encounter,) {
        // console.log("DEBUG22 Combat.js", encounter);
        this.character = character;
        this.npc = npc;
        console.log("You enter combat.");
        this.resolveCombat(character, startEncounter, useItem, prompt, nextEncounterId, encounter);
    }

    resolveCombat(character, startEncounter, useItem, prompt, nextEncounterId, encounter) {
        // console.log("DEBUG31 Combat.js", character);
        if (!this.npc) {
            console.log("NPC not found, cannot initiate combat.");
            return;
        }

        let combatActive = true;

        while (combatActive) {
            console.log(`Entering combat with ${this.npc.name}...`);
            const characterDamage = this.calculateDamage(this.character, this.npc);
            this.npc.health -= characterDamage;
            console.log(`${this.npc.name} takes ${characterDamage} damage, remaining health: ${this.npc.health}.`);

            if (this.npc.health <= 0) {
                console.log(`${this.npc.name} defeated!`);
                this.character.handleLoot(this.npc, items);
                this.character.pauseForIntermission(items, nextEncounterId, startEncounter, useItem, prompt, encounter);
                return;
            }

            const npcDamage = this.calculateDamage(this.npc, this.character);
            this.character.health -= npcDamage;
            console.log(`${this.character.name} takes ${npcDamage} damage, remaining health: ${this.character.health}.`);

            if (this.character.health <= 0) {
                console.log(`${this.character.name} has been defeated. Game Over.`);
                combatActive = false;
                continue;
            }

            const action = prompt("Do you wish to 'continue' fighting or 'flee'? ").toLowerCase();
            
            if (action === "flee") {
                // console.log("DEBUG65 Combat.js", character);
                console.log("You decided to flee. Returning to the encounter...");
                combatActive = false;
                startEncounter(encounter.getEncounterId(), character, prompt);
                return
            }  
        }
    }

    calculateDamage(source, target) {
        const items = require('../Data/items.js').items; // Make sure to import your items data

        const weapon = source.inventory.map(itemId => items.find(item => item.id === itemId)).find(item => item && (item.type === "melee" || item.type === "ranged" || item.type === "hacking"));
        let attackType = weapon ? weapon.type : "melee";
        let baseStat = source.str;
        if (attackType === "ranged") {
            baseStat = source.agi;
        } else if (attackType === "hacking") {
            baseStat = source.int;
        }

        let baseDamage = baseStat;
        if ("damage" in source) {
            baseDamage += Math.floor(Math.random() * source.damage) + 1;
        }

        if (weapon) {
            baseDamage += weapon.damage;
        }

        let totalArmor = target.armor || 0;
        if (target.inventory) {
            totalArmor = target.inventory.reduce((total, itemId) => {
                const item = items.find(item => item.id === itemId && item.type === "armor");
                return total + (item ? item.bonusAmount : 0);
            }, target.armor || 0);
    }

        const finalDamage = Math.max(0, baseDamage - totalArmor);
        return finalDamage;
    }

};
module.exports = Combat;