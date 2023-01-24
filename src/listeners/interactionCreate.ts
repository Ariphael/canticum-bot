import { CacheType, Interaction, ButtonInteraction, Client } from 'discord.js';
import { commands } from '../commands/commands';
import { Command } from '../commands/command-interface'


export const interactionCreate = (client: Client) => {
  client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await doHandleSlashCommand(commands, client, interaction);
    }
  });
}

export const doHandleSlashCommand = async (commandArr: Command[], client: Client, interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;   

  const slashCommand = commandArr.find(c => c.name === interaction.commandName);
  if (slashCommand === undefined) {
    await interaction.reply({ content: "An error has occurred!", ephemeral: true });
    return;
  }

  slashCommand.run(client, interaction);
}