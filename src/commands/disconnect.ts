import { Command } from './command-interface';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { clearQueue } from '../queue/songQueue';

export const Disconnect: Command = {
  name: 'disconnect',
  description: 'Disconnect from voice channel',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeDisconnect(client, interaction);
  }
};

export const executeDisconnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const embed = new EmbedBuilder().setColor(0x0099FF);
  const connection = getVoiceConnection(interaction.guild.id);
  
  if (connection) {
    const voiceChannelId = connection.joinConfig.channelId;
    (connection as VoiceConnection).destroy();
    embed.setDescription(
      `Successfully disconnected from voice channel ${voiceChannelId}`);
  } else {
    embed.setDescription(
      'Disconnect failed. Canticum must be connected to a voice channel first.');
    await interaction.reply({ 
      content: '', 
      components: [], 
      embeds: [embed], 
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({ content: '', components: [], embeds: [embed] });
}