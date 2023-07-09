import { 
  ApplicationCommandOptionType, 
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  EmbedBuilder
} from "discord.js";
import { Command } from "../interfaces/command-interface";
import { musicQueue } from "../queue/musicQueue";

export const swap: Command = {
  name: 'swap',
  description: 'swaps two items in the queue',
  options: [{
    type: ApplicationCommandOptionType.Integer,
    name: 'pos1',
    description: 'position in queue',
    required: true,
  }, {
    type: ApplicationCommandOptionType.Integer,
    name: 'pos2',
    description: 'position in queue',
    required: true,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeSwap(client, interaction);
  }
};

const executeSwap = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const positionA = interaction.options.getInteger('pos1');
  const positionB = interaction.options.getInteger('pos2');
  if (musicQueue.getItem(positionA) === undefined || musicQueue.getItem(positionB) === undefined) {
    embed.setTitle('Error')
      .setDescription('positionA and positionB must refer to valid positions in the queue. See queue using /queue');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
    return;
  } 

  musicQueue.swapQueuePositions(positionA, positionB);
  embed.setTitle('Swap')
    .setDescription(`Swapped position ${positionA} and ${positionB} of the queue. See queue using /queue`);
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
  });
}