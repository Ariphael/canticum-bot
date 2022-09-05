import { Client } from "discord.js";

export const handleReady = (client: Client): void => {
  if (client.user !== null) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
};