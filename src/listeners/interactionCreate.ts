import { ChatInputCommandInteraction, CacheType, Interaction } from "discord.js";

export const handleSlashCommand = async (): Promise<void> => {
  async (interaction: Interaction<CacheType>) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await doHandleSlashCommand(interaction);
    }
  }
};

const doHandleSlashCommand = async (interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;   

  const command = (interaction.client as any).commands.get(interaction.commandName);  
  if (!command) return;  

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
}