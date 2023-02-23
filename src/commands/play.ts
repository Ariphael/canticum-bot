import { Command } from '../interfaces/command-interface';
import { apikey } from '../config.json';
import axios from 'axios';
import { addSongRequest, getMusicQueueItem } from '../queue/songQueue';
import { 
  ApplicationCommandOptionType,
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { getVoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';

const ytLinkRegExp = 
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

export const play: Command = {
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

  const voiceConnection = getVoiceConnection(interaction.guild.id);
  if (voiceConnection === undefined) {
    embed.setDescription('Must be connected to voice channel first!');
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
    return;
  }

  const query = interaction.options.getString('query');
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

  const newQueueLength = ytLinkRegExp.test(query)
  ? await ytdl.getInfo(query)
      .then(({ videoDetails: { title, videoId } }) => addSongRequest(title, videoId))
      .catch(() => -1)
  : await axios({
      method: 'get',
      url: `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${apikey}`
    })
      .then(({ data: { items } }) => items.length ? addSongRequest(items[0].snippet.title, items[0].id.videoId) : -1);
  
  if (newQueueLength === -1) {
    embed.setTitle('Error')
      .setDescription('Cannot find song!');
  } else {
    const musicQueueItem = getMusicQueueItem(-1);
    const musicPlayerAvailabilityStatus = 
      !musicPlayerInstance.isPlayingAudio() && newQueueLength === 1;

    embed.setTitle(musicPlayerAvailabilityStatus ? 'Now Playing' : 'Added to Queue')
      .setDescription(musicQueueItem.musicTitle.toString())
      .setURL(`https://www.youtube.com/watch?v=${musicQueueItem.musicId}`)
      .setTimestamp();
  
    if (musicPlayerAvailabilityStatus) {
      musicPlayerInstance.playAudio();
    }
  }
      
  await interaction.reply({ content: '', components: [], embeds: [embed] });
};