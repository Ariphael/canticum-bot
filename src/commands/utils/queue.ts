import axios, { AxiosResponse } from 'axios';
import { EmbedBuilder } from 'discord.js';
import { musicQueue } from '../../queue/musicQueue';
import { spotifyAccessToken } from '../../../config/spotify.json';
import { enqueueSpotifyPlaylistRequest, enqueueSpotifyTrackRequest } from './play/spotify';
import { enqueueYouTubePlaylistRequest, enqueueYouTubeSongRequest } from './play/youtube';

/*
 * Contains auxiliary functions involved with interacting with the queue
 */

const failedYouTubeMusicQueryErrorStr = 'No song found associated with query';
const invalidSpotifyTrackIdErrorStr = 'Invalid track ID. Please check that the URL passed in the query is correct and try again.';
const emptySpotifyPlaylistErrorStr = 'Empty spotify playlist..?';
const unexpectedErrorStr = 'An unexpected error occurred.';

export const enqueueMusicYouTube = async (
  url: string, 
  embed: EmbedBuilder
) => {
  const includesPlaylistId = url.includes('list=');

  if (includesPlaylistId) {
    enqueueYouTubePlaylistRequest(url, embed);
  } else {
    enqueueYouTubeSongRequest(url, embed);
  }
}

export const enqueueMusicSpotify = async (
  url: string, 
  embed: EmbedBuilder
) => {
  
  const includesPlaylistId = url.includes('playlist/');
  const includesTrackId = url.includes('track/');

  if (includesPlaylistId) {
    await enqueueSpotifyPlaylistRequest(url, embed);
  } else if (includesTrackId) {
    await enqueueSpotifyTrackRequest(url, embed);
  }
}

export const enqueueMusicYouTubeNonURLQuery = async (
  query: string, 
  embed: EmbedBuilder
) => {
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

    embed.setTitle(newQueueLength > 1 ? 'Added to Queue' : 'Now Playing')
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
