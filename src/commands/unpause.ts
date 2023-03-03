import { getVoiceConnection } from "@discordjs/voice";
import { Client, ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { MusicPlayer } from "../musicplayer/MusicPlayer";

export const unpause: Command = {
  name: 'unpause', 
  description: 'unpause the music',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeUnpause(client, interaction);
  }
}; 

const executeUnpause = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
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
    musicPlayerInstance.unpauseAudio();
    embed.setTitle('Unpause')
      .setDescription('Unpaused the audio player.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    })
  }
}