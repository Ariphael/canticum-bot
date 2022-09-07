import { Client } from "discord.js";
import { Commands } from '../commands/commands';

export const ready = (client: Client) => {
  client.once('ready', async () => {
    if (client.user !== null) {
      if (!client.user || !client.application) {
        return;
      }
  
      await client.application.commands.set(Commands);
  
      console.log(`Ready! Logged in as ${client.user.tag}`);
    }
  });
}