// #file
class Encounter {
    constructor(data) {
        this.encounterId = data.encounterId;
        this.title = data.title;
        this.text = data.text;
        this.choices = data.choices;
        this.nextEncounterId = data.nextEncounterId;
    }

    // Method to get a choice by index
    getChoice(index) {
        return this.choices[index];
    }

    // Method to execute the immediate effect of a choice
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

    getEncounterId() {
        return this.encounterId;
    }

    getText() {
        return this.text;
    }

    getChoices() {
        return this.choices;
    }

    getNextEncounterId() {
        return this.nextEncounterId;
    }
}

class Choice {
    constructor(data) {
        this.text = data.text;
        this.attribute = data.attribute;
        this.difficulty = data.difficulty;
        this.immediateEffect = data.immediateEffect;
        this.effect = data.effect;
        this.success = data.success;
        this.failure = data.failure;
    }

    getText() {
        return this.text;
    }

    getImmediateEffect() {
        return this.immediateEffect;
    }

    getEffect() {
        return this.effect;
    }

    getAttribute() {
        return this.attribute;
    }

    getDifficulty() {
        return this.difficulty;
    }
}

module.exports = {Encounter, Choice}
