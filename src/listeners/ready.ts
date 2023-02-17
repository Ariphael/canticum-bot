import { Client, Collection } from "discord.js";
import { Command } from "../interfaces/command-interface";

export const ready = (client: Client, commandCollection: Collection<string, Command>) => {
  client.once('ready', async () => {
    if (client.user !== null) {
      if (!client.application) return;
      await client.application.commands.set(Array.from(commandCollection.values()));
      console.log(`Ready! Logged in as ${client.user.tag} (ID: ${client.user.id})`);
    }
  });
}