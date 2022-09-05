import { Client } from "discord.js";
import { token } from './config.json';
import ready from "./listeners/ready";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);

client.login(token);