// Items Data
const items = [
    { id: 1, name: "Hacking Device", bonusType: "int", bonusAmount: 2, value: 100, starterItem: true, replaces: [] },
    { id: 2, name: "Advanced Hacking Device", bonusType: "int", bonusAmount: 4, value: 200, starterItem: false, replaces: [1] },
    { id: 3, name: "Elite Hacking Device", bonusType: "int", bonusAmount: 5, value: 300, starterItem: false, replaces: [1, 2] },
    { id: 4, name: "Baton", type: "melee", bonusType: "str", bonusAmount: 1, value: 50, starterItem: true, replaces: [], damage: 3 },
    { id: 5, name: "Sword", type: "melee", bonusType: "str", bonusAmount: 3, value: 100, starterItem: false, replaces: [4], damage: 4 },
    { id: 7, name: "Bulletproof Vest", type: "armor", bonusType: "armor", bonusAmount: 1, value: 50, starterItem: true, replaces: [], damage: 0 },
    { id: 8, name: "Riot Shield", type: "armor", bonusType: "armor", bonusAmount: 3, value: 200, starterItem: false, replaces: [8], damage: 0 },
    { id: 20, name: "Stim Patch", type: "consumable", value: 25, starterItem: false, replaces: [], effect: "heal", amount: 10 },
    // Additional items...
];

// Utility Function
// Adds an item to a character's inventory, replacing any items as necessary
const addItemToCharacter = (character, newItemId) => {
    const newItem = items.find(item => item.id === newItemId);
    if (!newItem) {
        console.log("Item not found.");
        return;
    }

    if (Array.isArray(newItem.replaces) && newItem.replaces.length > 0) {
        newItem.replaces.forEach(replacedItemId => {
            const indexToRemove = character.inventory.findIndex(id => id === replacedItemId);
            if (indexToRemove !== -1) {
                character.inventory.splice(indexToRemove, 1);
            }
        });
    }

    character.inventory.push(newItemId);
};

module.exports = { items, addItemToCharacter };
