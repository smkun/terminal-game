// #file
class Item {
    constructor(data) {
        // Initializes an item with provided data
        this.id = data.id; //  Unique identifier for the item
        this.name = data.name; // Name of the item
        this.bonusType = data.bonusType; // Type of bonus (e.g., strength, agility, intelligence)
        this.bonusAmount = data.bonusAmount; // Amount of the bonus
        this.value = data.value; // Monetary value of the item
        this.starterItem = data.starterItem; // Indicates if the item is a starting item
        this.replaces = data.replaces; // Items this one can replace
        this.type = data.type; // Type of the item (e.g., weapon, armor, consumable)
        this.damage = data.damage; // Damage value, applicable for weapons
        this.effect = data.effect; // Special effect of the item
        this.amount = data.amount; // Amount of the effect or additional attributes
    }

    // Method to check if this item replaces another item
    replacesItem(itemId) {
        return this.replaces.includes(itemId);
    }

    // Getters for item properties
    getId() { return this.id; }
    getName() { return this.name; }
    getBonusType() { return this.bonusType; }
    getBonusAmount() { return this.bonusAmount; }
    getValue() { return this.value; }
    isStarterItem() { return this.starterItem; }
}

module.exports = Item;
