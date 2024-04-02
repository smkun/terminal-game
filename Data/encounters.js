// #file
// Encounter Data
const encounters = [
    {
        encounterId: 1,
        title: "Cybernetic Guard",
        text: "You encounter a cybernetic guard blocking your path. How do you proceed?",
        choices: [
            {
                text: "Hack the guard's programming to make it stand down.",
                attribute: "int",
                difficulty: 12,
                success: {
                    text: "The guard powers down, and you can proceed.",
                    immediateEffect: null,
                },
                failure: {
                    text: "Your hacking attempt fails, and the guard attacks!",
                    npcid: 1,
                    effect: "enterCombat",
                },
            },
            {
                text: "Sneak past the guard.",
                attribute: "agi",
                difficulty: 15,
                success: {
                    text: "You successfully sneak past the guard.",
                    immediateEffect: null, 
                    effect: () => console.log("You bypass the guard silently."),
                },
                failure: {
                    text: "You're spotted! The guard attacks.",
                    npcid: 1,
                    effect: "enterCombat",
                },
            },
            {
                text: "Overpower the guard with brute force.",
                attribute: "str",
                difficulty: 18,
                success: {
                    text: "You overpower the guard and knock it out.",
                    immediateEffect: null, 
                    effect: () => console.log("Guard is down. Path is clear."),
                },
                failure: {
                    text: "The guard is too strong! It pushes you back and attacks.",
                    npcid: 1,
                    effect: "enterCombat",
                },
            },
        ],
        nextEncounterId: 2,
    },
    {
        encounterId: 2,
        title: "Path to Infiltration",
        text: "After defeating the guard, you arrive in the alley near the building you must infiltrate. Do you take the sewers or climb the building?",
        choices: [
            {
                text: "Go through the sewers.",
                attribute: "int",
                difficulty: 10,
                success: {
                    text: "You navigate the sewers successfully and enter the building unseen.",
                    immediateEffect: null, 
                    effect: () => console.log("Entered through the sewers."),
                },
                failure: {
                    text: "You get lost in the sewers and end up back where you started.",
                    effect: () => console.log("Lost in sewers."),
                },
            },
            {
                text: "Climb the outside of the building.",
                attribute: "agi",
                difficulty: 14,
                success: {
                    text: "Your climb is successful, and you find an entry point on an upper level.",
                    immediateEffect: null, 
                    effect: () => console.log("Entered through the upper level."),
                },
                failure: {
                    text: "You slip and fall, alerting a nearby guard to your presence.",
                    npcId: 2,
                    immediateEffect: (character) => {
                        console.log("You've hurt yourself in the fall. You take 3 damage.");
                        character.health -= 3;
                    },
                    effect: "enterCombat",
                },
            },
        ],
        nextEncounterId: 3,
    },
    // Further encounters...
];

module.exports = { encounters };
