import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const JOKE = {
  name: "joke",
  description: "This command would retrive a joke from the joke API",
  type: 1
}

const NERD_JOKE = {
  name: "nerdjoke",
  description: "Get a nerd joke",
  type: 1
}

// create a command -> this is the schema of the commands https://discord.com/developers/docs/interactions/application-commands#slash-commands
const ELSIMON_COMMAND = {
  name: 'entonces',
  description: 'dumb command',
  type: 1, 
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, ELSIMON_COMMAND, JOKE, NERD_JOKE];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);