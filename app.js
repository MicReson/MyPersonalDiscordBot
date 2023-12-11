import "dotenv/config";
import express from "express";
import https from "node:https";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
} from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";

// Create an express app
const app = express();

const PORT = process.env.PORT;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  function GetJoke(joke_url) {
    https.get(joke_url, (response) => {
      response.on("data", (data) => {
        const jokeData = JSON.parse(data);
        const TheJoke = jokeData.joke;
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: TheJoke,
          },
        });
      });
    });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "Ya Simon " + getRandomEmoji(),
        },
      });
    }

    // by using the schemas of the commands you can get the name of the commands and decide what to do with it
    if (name === "entonces") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "Que tiro? ",
        },
      });
    }

    // command to tell jokes
    if (name === "joke") {
      const jokeURL = "https://v2.jokeapi.dev/joke/Any?type=single";
      GetJoke(jokeURL);
    }

    if (name === "nerdjoke") {
      const nerdJokeURL = "https://v2.jokeapi.dev/joke/Programming?type=single";
      GetJoke(nerdJokeURL);
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
