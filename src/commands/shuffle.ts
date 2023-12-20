import { Client, ChatInputCommandInteraction, CacheType, EmbedBuilder } from 'discord.js';
import { Command } from '../interfaces/command-interface';
import { musicQueue } from '../queue/musicQueue';

export const shuffle: Command = {
  name: 'shuffle',
  description: 'randomise the queue',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeShuffle(client, interaction);
  }
}

const executeShuffle = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const queueLength = musicQueue.getLength();

  if (queueLength > 1) musicQueue.shuffle();

  embed
    .setTitle(queueLength > 1 ? 'Shuffle' : 'Error')
    .setDescription(queueLength > 1
      ? 'Successfully shuffled queue. Use /queue to see current state of queue'
      : `A queue of size ${queueLength} cannot be shuffled. Use /queue to see current state of queue`
    )
    .setTimestamp();

  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
    ephemeral: queueLength <= 1
  });
}