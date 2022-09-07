import { CacheType, Interaction, ButtonInteraction, Client } from 'discord.js';
import { Commands } from '../commands/commands';


export const interactionCreate = (client: Client) => {
  client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await doHandleSlashCommand(client, interaction);
    }
  });
}

const doHandleSlashCommand = async (client: Client, interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;   

  const slashCommand = Commands.find(c => c.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.reply({ content: "An error has occurred!", ephemeral: true });
    return;
  }

  slashCommand.run(client, interaction);
}