// #file
class NPC {
    constructor(data) {
        // Initializes an NPC with provided data
        this.id = data.id; // Unique identifier for the NPC
        this.name = data.name; // Name of the NPC
        this.str = data.str; // Strength attribute
        this.agi = data.agi; // Agility attribute
        this.int = data.int; // Intelligence attribute
        this.health = data.health; // Health points of the NPC
        this.inventory = data.inventory; // Array of item IDs in the NPC's possession
        this.money = data.money; // Amount of money the NPC has
    }

    // Adds an item to the NPC's inventory
    addItem(itemId) {
        this.inventory.push(itemId);
    }

    // Removes an item from the NPC's inventory
    removeItem(itemId) {
        const index = this.inventory.indexOf(itemId);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }

    // Checks if the NPC has a specific item in their inventory
    hasItem(itemId) {
        return this.inventory.includes(itemId);
    }

    // Other methods can be added here to extend NPC functionalities as needed for game mechanics...
}

module.exports = NPC;
