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
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { MusicPlayer } from '../musicplayer/MusicPlayer';

export const connect: Command = {
  name: 'connect',
  description: 'Connect to voice channel',
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
    .setColor(0x0099FF)
    .setTitle('Connect');

  // requestedChannel and interaction.guild will never be null
  // @ts-ignore
  const requestedChannel: VoiceChannel = interaction.options.getChannel('channel')!;
  const voiceConnection = joinVoiceChannel({
    channelId: requestedChannel.id,
    guildId: interaction.guild!.id,
    adapterCreator: interaction.guild!.voiceAdapterCreator,
  });

  MusicPlayer.getMusicPlayerInstance()
    .addAudioPlayerToVoiceConnectionSubscriptions(voiceConnection);
  embed.setDescription(`Connected to voice channel ${requestedChannel.name}`);
  await interaction.reply({ content: '', components: [], embeds: [embed] });
};