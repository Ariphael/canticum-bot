import { Client } from "discord.js";
import { token } from './config.json';
import { handleReady } from "./listeners/ready";
import { handleSlashCommand } from "./listeners/interactionCreate";

console.log("Bot is starting...");

const client = new Client({
  intents: []
});

client.once("ready", handleReady);
client.on("interactionCreate", handleSlashCommand);

client.login(token);