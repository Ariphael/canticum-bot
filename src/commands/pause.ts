import { getVoiceConnection } from "@discordjs/voice";
import { Client, ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { MusicPlayer } from "../musicplayer/MusicPlayer";

export const pause: Command = {
  name: 'pause', 
  description: 'pause the music',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executePause(client, interaction);
  }
}; 

const executePause = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const voiceConnection = getVoiceConnection(interaction.guild.id);
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
  const embed = new EmbedBuilder();

  if (voiceConnection === undefined) {
    embed.setTitle('Error')
      .setDescription('There is no established voice connection. Use /connect to connect to a voice'
        + ' channel.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    });
  } else if (!musicPlayerInstance.isPlayingAudio()) {
    embed.setTitle('Error')
      .setDescription('There is no resource associated with the music player. Use /play to create'
        + ' a resource and add a song to the queue.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    });
  } else {
    musicPlayerInstance.pauseAudio();
    embed.setTitle('Pause')
      .setDescription('Paused the audio player.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    })
  }
};