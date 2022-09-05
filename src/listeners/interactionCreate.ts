import { ChatInputCommandInteraction, CacheType, Interaction } from 'discord.js';
import { Commands } from '../commands/commands'

export const handleSlashCommand = async (): Promise<void> => {
  async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await doHandleSlashCommand(interaction);
    }
  }
};

const doHandleSlashCommand = async (interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;   

  const slashCommand = Commands.find(c => c.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    return;
  }

  await interaction.deferReply();

  slashCommand.run(interaction);
}