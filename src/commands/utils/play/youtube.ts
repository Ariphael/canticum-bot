import axios, { AxiosResponse } from "axios";
import { musicQueue } from "../../../queue/musicQueue";
import { EmbedBuilder } from "discord.js";

const invalidYouTubePlaylistIDErrorStr = 
  'No YouTube playlist found associated with the id in the URL';
const emptyYouTubePlaylistURLErrorStr = 'Empty YouTube playlist URL';
const invalidYouTubeVideoURLErrorStr = 
  'No YouTube music can be found associated with the id in the URL';

export const enqueueYouTubePlaylistRequest = async (url: string, embed: EmbedBuilder) => {
  const playlistId = new URL(url).searchParams.get('list');
  var playlistItems: AxiosResponse<any, any>;

  try {
    playlistItems = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    )
      .then(apiResponse => apiResponse.data);
  } catch (error) {
    if (error.response) {
      // by process of elimination...
      throw new Error(invalidYouTubePlaylistIDErrorStr);
    }
    throw new Error(error.message);
  }
  
  if (playlistItems.data.length === 0) {
    throw new Error(emptyYouTubePlaylistURLErrorStr);
  }

  const playlistInfo = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
  )
    .then(apiResponse => apiResponse.data.items[0]);

  do {
    const nextPageToken = playlistItems.data.nextPageToken;
    playlistItems.data.items.forEach(playlistItem => {
      const musicId = playlistItem.contentDetails.videoId;
      musicQueue.enqueue({
        musicTitle: playlistItem.snippet.title,
        musicId: musicId,
        uploader: playlistItem.snippet.channelTitle,
        originalURL: `https://www.youtube.com/watch?v=${musicId}&list=${playlistId}`
      });
    });
    playlistItems = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&pageToken=${nextPageToken}&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    )
      .then(apiResponse => apiResponse.data);
  } while (playlistItems.data.nextPageToken !== undefined);  

  embed.setTitle(`${playlistInfo.snippet.localized.title}`)
    .setDescription(`Enqueued ${playlistInfo.contentDetails.itemCount} songs to the queue`)
    .setURL(url)
    .setTimestamp();
}

export const enqueueYouTubeSongRequest = async (url: string, embed: EmbedBuilder) => {
  const musicId = new URL(url).searchParams.get('v');
    
  try {
    const videoInfo = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${musicId}&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`
    )
      .then(apiResponse => apiResponse.data);
    musicQueue.enqueue({
      musicTitle: videoInfo.items[0].snippet.title,
      musicId: musicId,
      uploader: videoInfo.items[0].snippet.channelTitle,
      originalURL: url,      
    });

    embed.setTitle(musicQueue.getLength() > 1 ? 'Added to Queue' : 'Now Playing')
      .setDescription(videoInfo.items[0].snippet.title)
      .setURL(url)
      .setTimestamp();
  } catch (error) {
    if (error.response) {
      throw new Error(invalidYouTubeVideoURLErrorStr);
    } else if (error.request) {
      throw new Error(error.message);
    }
    throw error;
  }
}