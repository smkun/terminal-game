const items = [
    {id: 1, name: "Hacking Device", bonusType: "int", bonusAmount: 2, value: 100, starterItem: true, replaces: [],},
    {id: 2, name: "Advanced Hacking Device", bonusType: "int", bonusAmount: 4, value: 200, starterItem: false, replaces: [1],},
    {id: 3, name: "Elite Hacking Device", bonusType: "int", bonusAmount: 5, value: 300, starterItem: false, replaces: [1, 2],},
    {id: 4, name: "Baton", type: "melee", bonusType: "str", bonusAmount: 1, value: 50, starterItem: true, replaces: [], damage: 3,},
    {id: 5, name: "Sword", type: "melee", bonusType: "str", bonusAmount: 3, value: 100, starterItem: false, replaces: [4], damage: 4,},
    {id: 7, name: "Bulletproof Vest", type: "armor", bonusType: "armor", bonusAmount: 1, value: 50, starterItem: true, replaces: [], damage: 0,},
    {id: 8, name: "Riot Shield", type: "armor", bonusType: "armor", bonusAmount: 3, value: 200, starterItem: false, replaces: [8], damage: 0,},
    {id: 20, name: "Stim Patch", type: "consumable", value: 25, starterItem: false, replaces: [], effect: "heal", amount: 10,},
    
    // Additional items...
];

function addItemToCharacter(character, newItemId) {
    const newItem = items.find(item => item.id === newItemId);
    if (!newItem) {
        console.log("Item not found.");
        return;
    }

    // Check if newItem.replaces is not undefined and is an array before proceeding
    if (Array.isArray(newItem.replaces) && newItem.replaces.length > 0) {
        newItem.replaces.forEach(replacedItemId => {
            // Find and remove the replaced item from the character's inventory
            const indexToRemove = character.inventory.findIndex(id => id === replacedItemId);
            if (indexToRemove !== -1) {
                character.inventory.splice(indexToRemove, 1);
            }
        });
    }

    // Then add the new item's ID to the character's inventory
    character.inventory.push(newItemId);
    // console.log(character.inventory, character.money);
}



module.exports = { items, addItemToCharacter };
