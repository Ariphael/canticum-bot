import { Command } from '../interfaces/command-interface';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChannelType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
  VoiceChannel,
} from 'discord.js';
import { entersState, getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { MusicPlayer } from '../musicplayer/MusicPlayer';

export const connect: Command = {
  name: 'connect',
  description: 'Connect to/move to another voice channel',
  options: [{
    type: ApplicationCommandOptionType.Channel,
    name: 'channel',
    description: 'target voice channel',
    required: true,
    channelTypes: [ChannelType.GuildVoice],
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeConnect(client, interaction);
  }
};

const executeConnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const embed = new EmbedBuilder()
    .setTitle('Connect');
  const connection = getVoiceConnection(interaction.guild!.id);

  // requestedChannel and interaction.guild will never be null
  // @ts-ignore
  const requestedChannel: VoiceChannel = interaction.options.getChannel('channel')!;
  const voiceConnection = joinVoiceChannel({
    channelId: requestedChannel.id,
    guildId: interaction.guild!.id,
    adapterCreator: interaction.guild!.voiceAdapterCreator,
  });
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

  if (connection)
    (connection as VoiceConnection).destroy();

  musicPlayerInstance.addAudioPlayerToVoiceConnectionSubscriptions(voiceConnection);
  embed.setDescription(
    musicPlayerInstance.isAudioResourcePlayable()
    ? `Connected to voice channel ${requestedChannel.name}. The audio player is currently ${musicPlayerInstance.isPaused() ? 'paused' : 'unpaused'}`
    : `Connected to voice channel ${requestedChannel.name}. Add a song to the queue with '/play'!`
  );
  await interaction.reply({ content: '', components: [], embeds: [embed] });
};