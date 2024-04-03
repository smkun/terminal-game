# Ghostline

Ghostline is a text-based RPG developed in Node.js, offering players an immersive experience through a world filled with adventures, challenges, and the unknown. As a player, you will make choices that determine your path, engage in combat, interact with characters, and uncover the mysteries of Ghostline.

## Game Structure

The game's architecture is designed to be modular and scalable, consisting of several folders organizing the game's classes, data, and utilities. Here is an overview of the file structure:

- **Classes Folder:** Contains the core classes of the game.
  - `Characters.js`: Defines the player and their attributes.
  - `Combat.js`: Handles combat mechanics between the player and NPCs.
  - `Encounters.js`: Manages encounters the player can engage in, with choices and consequences.
  - `Items.js`: Defines items that the player can acquire, use, or interact with.
  - `NPCs.js`: Describes non-player characters within the game.

- **Data Folder:** Stores data files for initializing the game state.
  - `characters.js`: Contains data about player characters.
  - `encounters.js`: Lists possible encounters in the game.
  - `intro.js`: Provides an introduction text for the game.
  - `items.js`: Includes details about items in the game.
  - `npcs.js`: Details about the NPCs in the game.

- **Utils Folder:** Holds utility files that assist in the game's functionality.
  - `PromptSingleton.js`: A utility suggested by ChatGPT to standardize prompt import across all files that require user input.

- **Root Folder:** Contains the game's main executable file and this README.
  - `game.js`: The main game file that players run to start their adventure in Ghostline.
  - `README.md`: Provides an overview of the game, its structure, and how to get started.

## Getting Started

To begin your journey in Ghostline, you need to have Node.js installed on your machine. Follow these steps to set up and start the game:

1. Clone the repository or download the game files to your local machine.
2. Open a terminal in the root folder of the game.
3. Run `npm install` to install any dependencies.
4. Start the game by running `node game.js`.
5. Follow the on-screen prompts to make choices and progress through the game.

## Contributing

We welcome contributions to Ghostline! If you have suggestions for improvements, encounter any issues, or would like to contribute new features, please feel free to open an issue or a pull request.

Enjoy your adventure in Ghostline, where every choice can lead to a new destiny!
