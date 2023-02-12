import { Command } from './command-interface';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChannelType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { MusicPlayer } from '../musicplayer/MusicPlayer';

export const Connect: Command = {
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

export const executeConnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const embed = new EmbedBuilder().setColor(0x0099FF);
  const requestedChannelId = interaction.options.getChannel('channel').id;
  const voiceConnection = joinVoiceChannel({
    channelId: requestedChannelId,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  // Imperfect workaround to the issue where the bot has not moved voice channels and
  // entered a real disconnect scenario shown in the official discord.js guide
  voiceConnection.on(VoiceConnectionStatus.Disconnected, async (_oldState, _newState) => {
    try {
      await Promise.race([
        entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      // Seems to be reconnecting to a new channel - ignore disconnect
    } catch (error) {
      // Seems to be a real disconnect which SHOULDN'T be recovered from
      voiceConnection.destroy();
    }
  });

  MusicPlayer.getMusicPlayerInstance().addToVoiceConnectionSubscriptions(voiceConnection);
  embed.setDescription(`Connected to voice channel ${requestedChannelId}`);
  await interaction.reply({ content: '', components: [], embeds: [embed] });
};