import { CacheType, Interaction, Client, Collection } from 'discord.js';
import { Command } from '../interfaces/command-interface'

export const addInteractionCreateEventToClient = (client: Client, commandCollection: Collection<string, Command>) => {
  client.on(
    'interactionCreate', 
    interactionCreateListenerFn(client, commandCollection)
  );
}

const interactionCreateListenerFn = (
  client: Client,
  commandCollection: Collection<string, Command>
) => {
  return async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand()) {
      if (!interaction.isChatInputCommand()) return;   

      const slashCommand = commandCollection.get(interaction.commandName);
      if (slashCommand === undefined) {
        await interaction.reply({ content: "An error has occurred!", ephemeral: true });
        return;
      }

      try {
        await slashCommand.run(client, interaction);
      } catch (error) {
        await interaction.reply({ 
          content: 'There was an error while executing this command!', 
          ephemeral: true 
        });
      }
    } 
  } 
};