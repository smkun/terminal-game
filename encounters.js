const encounters = [
    {
        id: 1, 
        title: "Cybernetic Guard",
        text: "You encounter a cybernetic guard blocking your path. How do you proceed?",
        choices: [
            {
                text: "Hack the guard's programming to make it stand down.",
                attribute: "int",
                difficulty: 12,
                success: {
                    text: "The guard powers down, and you can proceed.",
                    effect: () => console.log("You bypass the guard."),
                },
                failure: {
                    text: "Your hacking attempt fails, and the guard attacks!",
                    effect: "enterCombat",
                },
            },
            {
                text: "Sneak past the guard.",
                attribute: "agi",
                difficulty: 15,
                success: {
                    text: "You successfully sneak past the guard.",
                    effect: () => console.log("You bypass the guard silently."),
                },
                failure: {
                    text: "You're spotted! The guard attacks.",
                    effect: "enterCombat",
                },
            },
            {
                text: "Overpower the guard with brute force.",
                attribute: "str",
                difficulty: 18,
                success: {
                    text: "You overpower the guard and knock it out.",
                    effect: () => console.log("Guard is down. Path is clear."),
                },
                failure: {
                    text: "The guard is too strong! It pushes you back and attacks.",
                    effect: "enterCombat",
                },
            },
        ],
    },
    // Additional encounters...
];


function startEncounter(encounterId, character) {
    const encounter = encounters.find((e) => e.id === encounterId);
    if (!encounter) {
        console.log("Encounter not found.");
        return;
    }

    console.log(encounter.text);
    encounter.choices.forEach((choice, index) => {
        console.log(`${index + 1}: ${choice.text}`);
    });

    let answer = parseInt(prompt("Choose an action: "), 10) - 1;
    const choice = encounter.choices[answer];

    if (!choice) {
        console.log("Invalid choice.");
        return;
    }

    const success = performAttributeCheck(
        choice.attribute,
        character,
        choice.difficulty
    );
    if (success) {
        console.log(choice.success.text);
        choice.success.effect(); // Execute the success effect
    } else {
        console.log(choice.failure.text);
        choice.failure.effect(); // Execute the failure effect
    }
}

module.exports = { encounters, startEncounter };
