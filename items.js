const items = [
    {
        id: 1,
        name: "Hacking Device",
        bonusType: "int",
        bonusAmount: 2,
        value: 100,
        starterItem: true,
        replaces: [],
    },
    {
        id: 2,
        name: "Advanced Hacking Device",
        bonusType: "int",
        bonusAmount: 4,
        value: 200,
        starterItem: false,
        replaces: [1],
    },
    {
        id: 3,
        name: "Elite Hacking Device",
        bonusType: "int",
        bonusAmount: 5,
        value: 300,
        starterItem: false,
        replaces: [1, 2],
    },
    {
        id: 4,
        name: 'Baton',
        type: 'melee',
        bonusType: 'str',
        bonusAmount: 1,
        value: 50,
        starterItem: false,
        replaces: [],
        damage: 5,
      },
      {
        id: 3,
        name: 'Riot Shield',
        type: 'armor',
        bonusType: 'armor',
        bonusAmount: 3,
        value: 200,
        starterItem: false,
        replaces: [],
        damage: 0,
      },
    // Additional items...
];

function addItemToCharacter(character, newItem) {
    // Check if the new item replaces any other items
    if (newItem.replaces && newItem.replaces.length > 0) {
        newItem.replaces.forEach((replacedItemId) => {
            // Find and remove each item being replaced
            const indexToRemove = character.inventory.findIndex(
                (item) => item.id === replacedItemId
            );
            if (indexToRemove !== -1) {
                // If found
                character.inventory.splice(indexToRemove, 1); // Remove the replaced item
            }
        });
    }
    // Then add the new item
    character.inventory.push(newItem);
}

module.exports = { items, addItemToCharacter };
