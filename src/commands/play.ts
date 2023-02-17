import { Command } from '../interfaces/command-interface';
import { apikey } from '../config.json';
import axios from 'axios';
import { addSongRequest } from '../queue/songQueue';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { getVoiceConnection } from '@discordjs/voice';

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

const executePlay = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const embed = new EmbedBuilder().setColor(0x0099FF);
  if (getVoiceConnection(interaction.guild.id) === undefined) {
    embed.setDescription('Must be connected to voice channel first!');
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
    return;
  }

  const query = interaction.options.getString('query');
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
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

  if (!musicPlayerInstance.isPlayingAudio() && newQueueLength === 1) {
    musicPlayerInstance.playAudio();
    embed.setTitle(`Now playing`);
  } else {
    embed.setTitle(`Added to Queue`);
  }
  embed.setDescription(youtubeApiResponse.data.items[0].snippet.title)
    .setURL(`https://www.youtube.com/watch?v=${youtubeApiResponse.data.items[0].id.videoId}`)
    .setTimestamp(); 
  
  await interaction.reply({ content: '', components: [], embeds: [embed] });
};