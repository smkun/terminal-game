// #file
// Import Statements
const { prompt } = require('../Utils/PromptSingleton.js');


// Display Function
// Displays the introduction of the game
const displayIntro = () => {
    console.clear();
    const introText = `
    


    #                                                                                       
    #   @@@@@@@@  @@@  @@@   @@@@@@    @@@@@@   @@@@@@@  @@@       @@@  @@@  @@@  @@@@@@@@  
    #  @@@@@@@@@  @@@  @@@  @@@@@@@@  @@@@@@@   @@@@@@@  @@@       @@@  @@@@ @@@  @@@@@@@@  
    #  !@@        @@!  @@@  @@!  @@@  !@@         @@!    @@!       @@!  @@!@!@@@  @@!       
    #  !@!        !@!  @!@  !@!  @!@  !@!         !@!    !@!       !@!  !@!!@!@!  !@!       
    #  !@! @!@!@  @!@!@!@!  @!@  !@!  !!@@!!      @!!    @!!       !!@  @!@ !!@!  @!!!:!    
    #  !!! !!@!!  !!!@!!!!  !@!  !!!   !!@!!!     !!!    !!!       !!!  !@!  !!!  !!!!!:    
    #  :!!   !!:  !!:  !!!  !!:  !!!       !:!    !!:    !!:       !!:  !!:  !!!  !!:       
    #  :!:   !::  :!:  !:!  :!:  !:!      !:!     :!:     :!:      :!:  :!:  !:!  :!:       
    #   ::: ::::  ::   :::  ::::: ::  :::: ::      ::     :: ::::   ::   ::   ::   :: ::::  
    #   :: :: :    :   : :   : :  :   :: : :       :     : :: : :  :    ::    :   : :: ::   
    #                                                                                       
                                                                                                                          
    Ghostline: Codebreakers

    In a neon-lit world, Ghostlines—the shadows—thrive. Their mission: infiltrate General Assembly, steal the Bugkiller Protocol.\n    A cure or chaos? The choice is theirs.                                                                        

    Press Enter to begin your mission...

    `;
    
    console.log(introText);
    prompt(); // Waits for the user to press "Enter"
};

module.exports = { displayIntro };
