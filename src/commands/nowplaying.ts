import { getVoiceConnection } from "@discordjs/voice";
import { Client, ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { Command } from "../interfaces/command-interface";
import { MusicPlayer } from "../musicplayer/MusicPlayer";

export const nowplaying: Command = {
  name: 'nowplaying', 
  description: 'show information about the song that is currently playing',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeNowPlaying(client, interaction);
  }
}; 

const executeNowPlaying = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const voiceConnection = getVoiceConnection(interaction.guild!.id);
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
  const embed = new EmbedBuilder();
  const currentlyPlayingSong = musicPlayerInstance.getCurrentPlayingSongInfo();

  if (voiceConnection === undefined) {
    embed.setTitle('Error')
      .setDescription('There is no established voice connection. Use /connect to connect to a voice'
        + ' channel.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
  } else if (!musicPlayerInstance.isPlayingAudio()) {
    embed.setTitle('Error')
      .setDescription('There is no resource associated with the music player. Use /play to create'
        + ' a resource and add a song to the queue.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });
  } else if (currentlyPlayingSong === undefined) {
    embed.setTitle('Error')
      .setDescription('There is no song that is currently playing.');
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
      ephemeral: true,
    });    
  } else {
    embed.setTitle('Currently Playing')
      .setDescription(`${currentlyPlayingSong.musicTitle}`)
      .setURL(`https://www.youtube.com/watch?v=${currentlyPlayingSong.musicId}`);
    await interaction.reply({
      content: '',
      components: [],
      embeds: [embed],
    })
  }
};