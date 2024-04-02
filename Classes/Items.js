// #file
class Item {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.bonusType = data.bonusType;
        this.bonusAmount = data.bonusAmount;
        this.value = data.value;
        this.starterItem = data.starterItem;
        this.replaces = data.replaces;
        this.type = data.type;
        this.damage = data.damage;
        this.effect = data.effect;
        this.amount = data.amount;
    }

    replacesItem(itemId) {
        return this.replaces.includes(itemId);
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getBonusType() {
        return this.bonusType;
    }

    getBonusAmount() {
        return this.bonusAmount;
    }

    getValue() {
        return this.value;
    }

    isStarterItem() {
        return this.starterItem;
    }
}

module.exports = Item;