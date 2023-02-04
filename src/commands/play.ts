import { Command } from './command-interface';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
import { apikey } from '../config.json';
import axios from 'axios';
import { addSongRequest, dequeue } from '../queue/songQueue';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { getAudioPlayer, isPlayingAudio, playAudio } from '../audioplayer/audioPlayer';
import { AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';

export const Play: Command = {
  name: 'play',
  description: 'plays song or adds song to queue',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'query',
    description: 'music name', 
    required: true,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executePlay(client, interaction);
  }
};

export const executePlay = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder().setColor(0x0099FF);
  if (getVoiceConnection(interaction.guild.id) === undefined) {
    embed.setDescription('Must be connected to voice channel first!');
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
    return;
  }

  const query = interaction.options.getString('query');
  const youtubeApiResponse = await axios({
    method: 'get',
    url: 
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}g&key=
      ${apikey}`
  });

  const newQueueLength = addSongRequest(
    youtubeApiResponse.data.items[0].snippet.title, 
    youtubeApiResponse.data.items[0].id.videoId
  );

  playAudio();

  if (!isPlayingAudio() && newQueueLength === 1) {
    embed.setTitle(`Now playing`)
      .setDescription(youtubeApiResponse.data.items[0].snippet.title)
      .setURL(`https://www.youtube.com/watch?v=${youtubeApiResponse.data.items[0].id.videoId}`)
      .setTimestamp();
  } else {
    embed.setTitle(`Added to Queue`)
      .setDescription(youtubeApiResponse.data.items[0].snippet.title)
      .setURL(`https://www.youtube.com/watch?v=${youtubeApiResponse.data.items[0].id.videoId}`)
      .setTimestamp();    
  }
  
  await interaction.reply({ content: '', components: [], embeds: [embed] });
};