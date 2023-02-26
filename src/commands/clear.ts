import { CacheType, ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { clearQueue } from "../queue/songQueue";
import { Command } from "../interfaces/command-interface";

export const clear: Command = {
  name: 'clear',
  description: 'clears queue',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeClear(client, interaction);
  }
};

const executeClear = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const queueClearSuccessFlag = clearQueue().length === 0;
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Clear')
    .setDescription(
      queueClearSuccessFlag 
      ? 'Queue cleared successfully!' 
      : 'Queue cleared unsuccessfully!'
    );

  await interaction.reply({ content: '', components: [], embeds: [embed] });
};