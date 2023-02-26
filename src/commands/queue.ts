import { 
  ApplicationCommandOptionType, 
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  EmbedBuilder
} from "discord.js";
import { getMusicQueueLength, getMusicQueueIterator } from "../queue/songQueue";
import { Command } from "../interfaces/command-interface";

export const queue: Command = {
  name: 'queue',
  description: 'shows current queue',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeQueue(client, interaction);
  }
};

const executeQueue = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const musicQueueLength = getMusicQueueLength();
  const embed = musicQueueLength === 0 
    ? new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Queue')
        .setDescription('Queue is empty!')
    : new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Queue [${musicQueueLength}]`);
  
  const musicQueueIterator = getMusicQueueIterator();
  Array.from(musicQueueIterator).forEach((musicQueueItem, index) => {
    embed.addFields({ name: `${index + 1}.`, value: musicQueueItem.musicTitle.toString() })
  });

  await interaction.reply({ content: '', components: [], embeds: [embed] });
}
