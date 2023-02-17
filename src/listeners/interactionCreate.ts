import { CacheType, Interaction, Client, Collection } from 'discord.js';
import { Command } from '../interfaces/command-interface'

export const interactionCreate = (client: Client, commandCollection: Collection<string, Command>) => {
  client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      if (!interaction.isChatInputCommand()) return;   

      const slashCommand = commandCollection.get(interaction.commandName);
      if (slashCommand === undefined) {
        await interaction.reply({ content: "An error has occurred!", ephemeral: true });
        return;
      }
    
      try {
        slashCommand.run(client, interaction);
      } catch (error) {
        await interaction.reply({ 
          content: 'There was an error while executing this command!', 
          ephemeral: true 
        });
      }
    }
  });
}