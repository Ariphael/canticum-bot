import { Command } from './command-interface';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChannelType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';

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
    await executeConnect(client, interaction, false);
  }
};

export const executeConnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>, testMode: boolean): Promise<void> => {
  const embed = new EmbedBuilder().setColor(0x0099FF);
  const requestedChannelId = interaction.options.getChannel('channel').id;

  if (testMode) {
    console.log('joinVoiceChannel');
  } else {
    joinVoiceChannel({
      channelId: interaction.options.getChannel('channel').id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
  }

  embed.setDescription(`Connected to voice channel ${requestedChannelId}`);

  await interaction.reply({ content: '', components: [], embeds: [embed] });
};