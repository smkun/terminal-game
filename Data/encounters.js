// #file
// Encounter Data
const encounters = [
    {
        encounterId: 1,
        title: "Approaching General Assembly",
        text: "As you approach the General Assembly, a towering edifice of cybernetic advancements, a cybernetic guard blocks your path.\nIts mechanical eyes lock onto you, assessing your every move. How do you proceed?",
        choices: [
            {
                text: "Hack the guard's programming to make it stand down.",
                attribute: "int",
                difficulty: 12,
                success: {
                    text: "The guard powers down, allowing you to proceed.",
                    immediateEffect: null,
                },
                failure: {
                    text: "Your hacking attempt fails, and the guard prepares to attack!",
                    npcid: 1,
                    effect: "enterCombat",
                },
            },
            {
                text: "Sneak past the guard.",
                attribute: "agi",
                difficulty: 15,
                success: {
                    text: "You successfully maneuver past the guard.",
                    immediateEffect: null,
                    effect: () => console.log("You bypass the guard with stealth."),
                },
                failure: {
                    text: "You're spotted! The guard engages.",
                    npcid: 1,
                    effect: "enterCombat",
                },
            },
            {
                text: "Overpower the guard with brute force.",
                attribute: "str",
                difficulty: 18,
                success: {
                    text: "With sheer strength, you overpower the guard and clear your path.",
                    immediateEffect: null,
                    effect: () => console.log("Guard subdued. Path is clear."),
                },
                failure: {
                    text: "The guard proves too strong! It counterattacks.",
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
    {
        encounterId: 3,
        title: "The Locked Door",
        text: "After entering the building, you're faced with a securely locked door. The lock glares at you with a digital smirk.\nIt's standing between you and your objective. A panel next to it suggests multiple methods of entry.",
        choices: [
            {
                text: "Attempt to hack the door's security.",
                attribute: "int",
                difficulty: 13,
                success: {
                    text: "Your fingers dance across the panel, and the door clicks open.",
                    immediateEffect: null,
                },
                failure: {
                    text: "A surge of electricity shocks you as the hack fails.",
                    immediateEffect: (character) => {
                        console.log("You take 3 points of damage from the shock.");
                        character.health -= 3;
                    },
                },
            },
            {
                text: "Bash the door open with force.",
                attribute: "str",
                difficulty: 16,
                success: {
                    text: "The door gives way under your might.",
                    immediateEffect: null,
                },
                failure: {
                    text: "An electrified barrier repels you, dealing damage.",
                    immediateEffect: (character) => {
                        console.log("You take 3 points of damage from the electrified barrier.");
                        character.health -= 3;
                    },
                },
            },
            {
                text: "Use the ventilation system to bypass the door.",
                attribute: "agi",
                difficulty: 14,
                success: {
                    text: "You navigate through the vents and drop quietly on the other side of the door.",
                    immediateEffect: null,
                },
                failure: {
                    text: "You cut yourself on a sharp piece of metal, losing blood.",
                    immediateEffect: (character) => {
                        console.log("You take 3 points of damage from the sharp metal.");
                        character.health -= 3;
                    },
                },
            },
        ],
        nextEncounterId: 4,
    },
    {
        encounterId: 4,
        title: "Data Heist in the Lab",
        text: "Quiet as the shadows, you find yourself in the lab. The data you need gleams within the servers in front of you. Nearby,\nan unsuspecting tech named Matt holds a keycard you might need.",
        choices: [
            {
                text: "Hack the terminal to extract the data quietly.",
                attribute: "int",
                difficulty: 18,
                success: {
                    text: "The data streams into your device unnoticed. 'Bug-Killer Protocol' acquired.",
                    immediateEffect: null,
                },
                failure: {
                    text: "An alarm blares as your hack alerts the system! A robot guard initiates combat protocol.",
                    npcId: 3,
                    effect: "enterCombat",
                },
            },
            {
                text: "Pickpocket Matt for the access keycard.",
                attribute: "agi",
                difficulty: 15,
                success: {
                    text: "Like a ghost, you relieve Matt of his keycard and access the data. 'Bug-Killer Protocol' secured.",
                    immediateEffect: null,
                },
                failure: {
                    text: "Matt catches your hand in his pocket! The robot guard turns to engage.",
                    npcId: 3,
                    effect: "enterCombat",
                },
            },
            {
                text: "Rip the hard drives out of the servers.",
                attribute: "str",
                difficulty: 20,
                success: {
                    text: "You forcefully extract the drives, securing the 'Bug-Killer Protocol', but you've triggered an alarm! A robot guard approaches.",
                    npcId: 3,
                    immediateEffect: null,
                    effect: "enterCombat",
                },
                failure: {
                    text: "The servers are alarmed, and a robot guard moves to intercept you.",
                    npcId: 3,
                    effect: "enterCombat",
                },
            },
        ],
        nextEncounterId: 5,
    },
    {
        encounterId: 5,
        title: "The Escape",
        text: "With the 'Bug-Killer Protocol' in hand, you make a swift exit. The mission is a success. A HUGE payday awaits as you vanish into the neon-lit night of the city,\nleaving no trace behind.",
        choices: [],
        nextEncounterId: null,
    },
];

module.exports = { encounters };
