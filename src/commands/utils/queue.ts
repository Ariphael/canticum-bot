import axios, { AxiosResponse } from 'axios';
import { EmbedBuilder } from 'discord.js';
import { musicQueue } from '../../queue/musicQueue';
import { spotifyAccessToken } from '../../../config/spotify.json';
import { enqueueSpotifyAlbumRequest, enqueueSpotifyPlaylistRequest, enqueueSpotifyTrackRequest } from './play/spotify';
import { enqueueYouTubePlaylistRequest, enqueueYouTubeSongRequest } from './play/youtube';

/*
 * Contains auxiliary functions involved with interacting with the queue
 */

const failedYouTubeMusicQueryErrorStr = 'No song found associated with query';
const invalidSpotifyTrackIdErrorStr = 'Invalid track ID. Please check that the URL passed in the query is correct and try again.';
const emptySpotifyPlaylistErrorStr = 'Empty spotify playlist..?';
const unexpectedErrorStr = 'An unexpected error occurred.';

export const enqueueMusicYouTube = async (url: string): Promise<EmbedBuilder> => {
  const includesPlaylistId = url.includes('list=');

  if (includesPlaylistId) {
    // do this for enqueueyoutubesongrequest
    return await enqueueYouTubePlaylistRequest(url);
  } else {
    return await enqueueYouTubeSongRequest(url);
  }
}

export const enqueueMusicSpotify = async (url: string): Promise<EmbedBuilder> => {
  
  const includesPlaylistId = url.includes('playlist/');
  const includesTrackId = url.includes('track/');
  const includesAlbumId = url.includes('album/');

  if (includesPlaylistId) {
    return await enqueueSpotifyPlaylistRequest(url);
  } else if (includesTrackId) {
    return await enqueueSpotifyTrackRequest(url);
  } else if (includesAlbumId) {
    return await enqueueSpotifyAlbumRequest(url);
  }
}

export const enqueueMusicYouTubeNonURLQuery = async (query: string): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder();
  try {
    const videoInfo = await axios
      .get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${process.env.YOUTUBE_API_KEY}`)
      .then(({ data: { items } }) => {
        return items.length > 0 ? {
          musicTitle: items[0].snippet.title,
          musicId: items[0].id.videoId,
          uploader: items[0].snippet.channelTitle,
          originalURL: `https://www.youtube.com/watch?v=${items[0].id.videoId}`,
        } : undefined;
      });
    
    const newQueueLength = musicQueue.enqueue(videoInfo);

    return embed.setTitle(newQueueLength > 1 ? 'Added to Queue' : 'Now Playing')
      .setDescription(videoInfo.musicTitle)
      .setURL(`https://www.youtube.com/watch?v=${videoInfo.musicId}`)
      .setTimestamp(); 
  } catch (error) {
    if (error.response) {
      throw new Error(failedYouTubeMusicQueryErrorStr);
    } else if (error.request) {
      throw new Error(error.message);
    }
    throw error;
  }
}
