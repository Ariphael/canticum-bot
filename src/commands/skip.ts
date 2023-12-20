import { Client, ChatInputCommandInteraction, CacheType, EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { musicQueue } from "../queue/musicQueue";

const musicPlayer = MusicPlayer.getMusicPlayerInstance();

export const skip: Command = {
  name: 'skip',
  description: 'stop playback of current song (if any) and goes to next song/specified position in queue',
  options: [{
      type: ApplicationCommandOptionType.Subcommand,
      name: 'to',
      description: 'skips to a specified position in queue (warning: dequeues all items up to the specified position)',
      options: [{
        type: ApplicationCommandOptionType.Integer,
        name: 'position',
        description: 'position in queue',
        required: true,
      }],
    }, {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'next',
      description: 'skip to next song in queue',
    }
  ],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeSkip(client, interaction);
  }
};

const executeSkip = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const subcommand = interaction.options.getSubcommand();

  if (!musicPlayer.isPlayingAudio()) {
    embed
      .setTitle('Error')
      .setDescription('there is no underlying resource that is playable.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    })
    return;
  }

  if (subcommand === 'to') {
    await executeSkipTo(interaction, embed);
  } else if (subcommand === 'next') {
    await executeSkipNext(interaction, embed);
  }
}

const executeSkipTo = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const position = interaction.options.get('position').value as number;

  if (musicQueue.getItem(position) === undefined) {
    embed.setTitle('Error')
      .setDescription(`There exists no song at position ${position} in the queue. Use /queue to view the queue`);
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
    return;    
  }

  await skipToPositionInQueue(interaction, embed, position);
};

const executeSkipNext = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  try {
    musicPlayer.stopAudioPlayer();
    musicPlayer.playAudio()
    embed.setTitle('Skip')
      .setDescription(musicQueue.getLength() === 0
        ? 'Skipped the current song. Queue is empty!'
        : 'Skipped to next song in queue');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    });
  } catch (error) {
    embed.setTitle('Error')
      .setDescription(`An error occurred while trying to skip to the next song in the queue`);
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
  }      
}

const skipToPositionInQueue = async (
  interaction: ChatInputCommandInteraction<CacheType>, 
  embed: EmbedBuilder, 
  position: number,
) => {
  for (var dequeueIterator = 0; dequeueIterator < position - 1; dequeueIterator++) {
    musicQueue.dequeue();
  };

  try {
    musicPlayer.stopAudioPlayer();
    musicPlayer.playAudio()
    embed.setTitle('Skip')
      .setDescription(`Skipped to position ${position} in queue`);
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    });
  } catch (error) {
    embed.setTitle('Error')
      .setDescription(`An error occurred while trying to skip to position ${position} in queue`);
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
  }
}