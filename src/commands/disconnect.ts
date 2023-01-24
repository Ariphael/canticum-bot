import { Command } from './command-interface';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';

export const Disconnect: Command = {
  name: 'disconnect',
  description: 'Disconnect from voice channel',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeDisconnect(client, interaction, 0);
  }
};

// testMode < 0 - connection = false
// testMode = 0 - connection = getVoiceConnection(interaction.guild.id)
// testMode > 0 - connection = true
export const executeDisconnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>, testMode: Number): Promise<void> => {
  const embed = new EmbedBuilder().setColor(0x0099FF);
  const connection = testMode < 0 ? 
    false : 
    (testMode > 0 ? 
    true : 
    getVoiceConnection(interaction.guild.id));
  
  if (connection) {
    const voiceChannelId = typeof connection === 'boolean' ? -1 : connection.joinConfig.channelId;
    if (voiceChannelId !== -1) (connection as VoiceConnection).destroy();

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