import { ApplicationCommandOptionType, Client, ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { getMusicQueueLength, removeQueueItem, removeQueueItemsRange } from "../queue/songQueue";

export const remove: Command = {
  name: 'remove',
  description: 'remove item(s) from the queue',
  options: [{
    type: ApplicationCommandOptionType.Subcommand,
    name: 'item',
    description: 'remove an item from the queue',
    options: [{
      type: ApplicationCommandOptionType.Integer,
      name: 'position',
      description: 'position in the queue',
      required: true,
    }]
  }, {
    type: ApplicationCommandOptionType.Subcommand,
    name: 'range',
    description: 'remove a specified range of items from the queue. (start to end inclusive)',
    options: [{
      type: ApplicationCommandOptionType.Integer,
      name: 'start',
      description: 'position in the queue (start of range)',
      required: true,
    }, {
      type: ApplicationCommandOptionType.Integer,
      name: 'end',
      description: 'position in the queue (end of range)', 
      required: true,
    }]
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeRemove(client, interaction);
  }
};

const executeRemove = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'item') {
    await executeRemoveItem(interaction);
  } else if (subcommand === 'range') {
    await executeRemoveRange(interaction);
  }
}

const executeRemoveItem = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const positionOption = interaction.options.getInteger('position');
  if (positionOption < 1 || positionOption > getMusicQueueLength()) {
    embed.setTitle('Error')
      .setDescription(`${positionOption} does not refer to a valid position in the queue. See the queue using /queue`);
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  const queueItem = removeQueueItem(positionOption - 1);
  embed.setTitle('Remove')
    .setDescription(`Successfully removed item ${queueItem.musicTitle} from position ${positionOption} of the queue`);
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
  });
};

const executeRemoveRange = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const queueLength = getMusicQueueLength();
  const startPosition = interaction.options.getInteger('start');
  const endPosition = interaction.options.getInteger('end');
  if (startPosition < 1 
    || endPosition < 1
    || startPosition > queueLength 
    || endPosition > queueLength 
  ) {
    embed.setTitle('Error')
      .setDescription('start and end must refer to valid positions in the queue. See queue using /queue');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  const removedItems = removeQueueItemsRange(startPosition, endPosition);
  embed.setTitle('Remove')
    .setDescription('Removed the following items from the queue: ');
  removedItems.forEach((musicQueueItem, index) => {
    embed.addFields({ 
      name: `${startPosition + index}.`, 
      value : `${musicQueueItem.musicTitle}`,
    });
  });
  await interaction.reply({
    content: '',
    components: [],
    embeds: [embed],
  });
}