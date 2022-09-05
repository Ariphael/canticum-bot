import { Client } from "discord.js";
import { Commands } from '../commands/commands';

export const handleReady = async (client: Client) => {
  if (client.user !== null) {
    if (!client.user || !client.application) {
      return;
    }

    await client.application.commands.set(Commands);

    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
};