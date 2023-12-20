import { Command } from '../interfaces/command-interface';
import { 
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';
import { MusicPlayer } from '../musicplayer/MusicPlayer';

export const disconnect: Command = {
  name: 'disconnect',
  description: 'Disconnect from voice channel. Pauses any resource associated with the audio player',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeDisconnect(client, interaction);
  }
};

const executeDisconnect = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const embed = new EmbedBuilder()
    .setTitle('Disconnect');
  const connection = getVoiceConnection(interaction.guild!.id);
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
  
  if (connection) {
    if (musicPlayerInstance.isAudioResourcePlayable()) 
      musicPlayerInstance.pauseAudio();
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