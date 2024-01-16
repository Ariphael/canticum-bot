import { Command } from '../interfaces/command-interface';
import { musicQueue } from '../queue/musicQueue';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { getVoiceConnection } from '@discordjs/voice';
import { enqueueMusicAndBuildEmbed } from './utils/queue';

const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

export const play: Command = {
  name: 'play',
  description: 'commences playback or enqueues song',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'query',
    description: 'youtube or spotify link or query',
    required: false,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executePlay(client, interaction);
  }
};

const executePlay = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder();
  const query = interaction.options.get('query')
    ? interaction.options.get('query').value as string
    : undefined;
  const voiceConnection = getVoiceConnection(interaction.guild!.id);
  const musicQueueOldLength = musicQueue.getLength();

  if (query === undefined) {
    if (!musicPlayerInstance.isPlayingAudio()) {
      musicPlayerInstance.playAudio();
      embed.setTitle('Play')
        .setDescription('Commenced playback')
        .setTimestamp();
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }
    embed.setTitle('Error')
      .setDescription(musicPlayerInstance.isPaused 
        ? 'Playback is paused. Use /unpause instead.' 
        : 'Music player is currently playing audio')
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
  }

  if (voiceConnection === undefined) {
    embed.setTitle('Error')
      .setDescription('Must be connected to voice channel first!');
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
    return;
  } 

  // This is a command that might take longer than 3 seconds to respond. For instance, 
  // a substantial amount of time may be consumed by fetching items in a long playlist.
  await interaction.deferReply();

  await enqueueMusicAndBuildEmbed(query, embed, interaction.user.id);

  if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio()) {
    musicPlayerInstance.playAudio();
  }

  await interaction.editReply({ 
    content: '', 
    components: [], 
    embeds: [embed],
  });
}