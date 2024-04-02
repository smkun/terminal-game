// #file
class NPC {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.str = data.str;
        this.agi = data.agi;
        this.int = data.int;
        this.health = data.health;
        this.inventory = data.inventory;
        this.money = data.money;
    }

    // Method to add an item to the NPC's inventory
    addItem(itemId) {
        this.inventory.push(itemId);
    }

    // Method to remove an item from the NPC's inventory
    removeItem(itemId) {
        const index = this.inventory.indexOf(itemId);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }

    // Method to check if the NPC has an item in their inventory
    hasItem(itemId) {
        return this.inventory.includes(itemId);
    }

    // Other methods as needed for game mechanics...
}

module.exports = NPC;