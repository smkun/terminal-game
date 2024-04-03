// #file
class Encounter {
    constructor(data) {
        // Initializes an encounter with provided data
        this.encounterId = data.encounterId; // Unique identifier for the encounter
        this.title = data.title; // Title of the encounter
        this.text = data.text; // Text description of the encounter
        this.choices = data.choices; // Array of choices available to the player
        this.nextEncounterId = data.nextEncounterId; // Identifier for the next encounter
    }

    // Method to get a choice by index
    getChoice(index) {
        return this.choices[index];
    }

    // Method to execute the immediate effect of a choice on a character
    executeImmediateEffect(choice, character) {
        if (choice.immediateEffect) {
            choice.immediateEffect(character);
        }
    }

    // Method to execute the effect of a choice
    executeEffect(choice) {
        if (typeof choice.effect === 'function') {
            choice.effect();
        } else if (choice.effect !== undefined) {
            console.log(`Effect: ${choice.effect}`);
        }
    }

    // Getters for encounter properties
    getEncounterId() { return this.encounterId; }
    getText() { return this.text; }
    getChoices() { return this.choices; }
    getNextEncounterId() { return this.nextEncounterId; }
}

// Definition of the Choice class
class Choice {
    constructor(data) {
        // Initializes a choice with provided data
        this.text = data.text;
        this.attribute = data.attribute;
        this.difficulty = data.difficulty;
        this.immediateEffect = data.immediateEffect;
        this.effect = data.effect;
        this.success = data.success;
        this.failure = data.failure;
    }

    // Getters for choice properties
    getText() { return this.text; }
    getImmediateEffect() { return this.immediateEffect; }
    getEffect() { return this.effect; }
    getAttribute() { return this.attribute; }
    getDifficulty() { return this.difficulty; }
}

module.exports = {Encounter, Choice}
