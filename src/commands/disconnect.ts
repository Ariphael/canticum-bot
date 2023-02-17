import { Command } from '../interfaces/command-interface';
import { 
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';

export const Disconnect: Command = {
  name: 'disconnect',
  description: 'Disconnect from voice channel',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeDisconnect(client, interaction);
  }
};

const executeDisconnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Disconnect');
  const connection = getVoiceConnection(interaction.guild.id);
  
  if (connection) {
    (connection as VoiceConnection).destroy();
    embed.setDescription(
      `Successfully disconnected from voice channel`);
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