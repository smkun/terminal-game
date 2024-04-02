// #file
// Import Statements
const { prompt } = require('../Utils/PromptSingleton.js');


// Display Function
// Displays the introduction of the game
const displayIntro = () => {
    console.clear();
    const introText = `
    Welcome to The Adventure Game!
    --------------------------------
    Your journey begins in a world filled with dangers and mysteries.
    
    Press "Enter" when you are ready to continue...
    `;
    
    console.log(introText);
    prompt(); // Waits for the user to press "Enter"
};

module.exports = { displayIntro };
