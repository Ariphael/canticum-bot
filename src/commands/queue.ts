import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  EmbedBuilder
} from "discord.js";
import { musicQueue } from "../queue/musicQueue";
import { Command } from "../interfaces/command-interface";

const resultsPerPage = 10;

export const queue: Command = {
  name: 'queue',
  description: `shows current queue (${resultsPerPage} results/page)`,
  options: [{
    type: ApplicationCommandOptionType.Integer,
    name: 'page',
    description: 'queue page number',
    required: false,
    minValue: 1,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeQueue(client, interaction);
  }
};

const executeQueue = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const queueMaxPage = Math.ceil(musicQueue.getLength() / resultsPerPage);
  const musicQueueLength = musicQueue.getLength();
  const pageOption = interaction.options.getInteger('page');
  const pageNum = pageOption === null
    ? 0
    : Math.min(pageOption - 1, queueMaxPage);

  const embed = musicQueueLength === 0 
    ? new EmbedBuilder()
        .setTitle('Queue')
        .setDescription('Queue is empty!')
        .setTimestamp()
        .setFooter({ text: 'page 1/1' })
    : new EmbedBuilder()
        .setTitle(`Queue [${musicQueueLength}]`)
        .setTimestamp()
        .setFooter({ text: `page ${pageNum + 1}/${queueMaxPage}`});
  
  const musicQueueIterator = musicQueue.getQueueSliceIterator(
    resultsPerPage * pageNum, 
    resultsPerPage * (pageNum + 1)
  );

  Array.from(musicQueueIterator).some((musicQueueItem, index) => {
    embed.addFields({ 
      name: `${index + (resultsPerPage * pageNum) + 1}.`, 
      value: musicQueueItem.musicTitle.toString() 
    });
    return index + 1 === resultsPerPage;
  });

  await interaction.reply({ content: '', components: [], embeds: [embed] });
}
