import { Client } from "discord.js";
import { commands } from '../commands/commands';

export const ready = (client: Client) => {
  client.once('ready', async () => {
    await doHandleReady(client);
  });
}

export const doHandleReady = async (client: Client) => {
  if (client.user !== null) {
    if (!client.user || !client.application) {
      return;
    }

    await client.application.commands.set(commands);

    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
}