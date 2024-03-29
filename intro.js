const prompt = require('prompt-sync')({sigint: true});

function displayIntro() {
    console.clear(); // Optional: Clears the console before displaying the intro
    // Your game's introduction text
    const introText = `
    Welcome to The Adventure Game!
    --------------------------------
    Your journey begins in a world filled with dangers and mysteries.
    
    Press "Enter" when you are ready to continue...
    `;
    
    console.log(introText);
    prompt(); // Waits for the user to press "Enter"
}

module.exports = { displayIntro };
