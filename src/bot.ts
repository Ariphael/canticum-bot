import { Client, GatewayIntentBits } from "discord.js";
import { token } from './config.json';
import { handleReady } from "./listeners/ready";
import { callbackSlashCommandFunction } from "./listeners/interactionCreate";

console.log("Bot is starting...");

const client = new Client({
  intents: [ GatewayIntentBits.Guilds ]
});

client.once("ready", handleReady);

client.on("interactionCreate", callbackSlashCommandFunction);

client.login(token);