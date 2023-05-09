import axios, { AxiosResponse } from 'axios';
import { EmbedBuilder } from 'discord.js';
import { musicQueue } from '../../queue/musicQueue';
import { spotifyAccessToken } from '../../../config/config.json';

const invalidYouTubePlaylistIDErrorStr = 'No YouTube playlist found associated with the id in the URL';
const emptyYouTubePlaylistURLErrorStr = 'Empty YouTube playlist URL';
const invalidYouTubeVideoURLErrorStr = 'No YouTube music can be found associated with the id in the URL';
const failedYouTubeMusicQueryErrorStr = 'No song found associated with query';
const noApiResponseErrorStr = 'No response from API. Please try the command again.';
const unexpectedErrorStr = 'An unexpected error occurred.';

export const enqueueYouTubeMusicInfoFromURL = async (
  urlStr: string, 
  embed: EmbedBuilder
): Promise<number> => {
  const musicQueueLength = musicQueue.getLength();
  const includesPlaylistId = urlStr.includes('list=');

  if (includesPlaylistId) {
    const playlistId = new URL(urlStr).searchParams.get('list');
    var playlistItems;

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
    
    if (playlistItems.length === 0) {
      throw new Error(emptyYouTubePlaylistURLErrorStr);
    }

    const playlistInfo = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    )
      .then(apiResponse => apiResponse.data.items[0]);
  
    do {
      const nextPageToken = playlistItems.nextPageToken;
      playlistItems.items.forEach(playlistItem => {
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
    } while (playlistItems.nextPageToken !== undefined);  

    embed.setTitle(`${playlistInfo.snippet.localized.title}`)
      .setDescription(`Enqueued ${playlistInfo.contentDetails.itemCount} songs to the queue`)
      .setURL(urlStr)
      .setTimestamp();
  } else {
    const musicId = new URL(urlStr).searchParams.get('v');

    if (!musicId) return musicQueueLength;
    
    try {
      const videoInfo = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${musicId}&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`
      )
        .then(apiResponse => apiResponse.data);

      musicQueue.enqueue({
        musicTitle: videoInfo.items[0].snippet.title,
        musicId: musicId,
        uploader: videoInfo.items[0].snippet.channelTitle,
        originalURL: urlStr,      
      });
  
      embed.setTitle(musicQueue.getLength() > 1 ? 'Added to Queue' : 'Now Playing')
        .setDescription(videoInfo.items[0].snippet.title)
        .setURL(urlStr)
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

  return musicQueue.getLength();
}

export const enqueueSpotifyMusicInfoFromURL = async (
  urlStr: string, 
  embed: EmbedBuilder
): Promise<number> => {
  const musicQueueLength = musicQueue.getLength();
  const pathname = new URL(urlStr).pathname;
  const includesPlaylistId = urlStr.includes('playlist/');

  if (includesPlaylistId) {
    const playlistId = pathname.slice(pathname.lastIndexOf('/') + 1);
    const spotifyPlaylistInfo: AxiosResponse<any, any> | undefined = 
      await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        }
      }).catch(() => undefined);
  
    if (!spotifyPlaylistInfo || spotifyPlaylistInfo.data.tracks.items.length === 0) {
      return musicQueueLength;
    }

    var playlistItems: AxiosResponse<any, any> | undefined = 
      await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        }
      }).catch(() => undefined);
  
    if (!playlistItems) return musicQueueLength;
    
    do {
      playlistItems.data.items.forEach(async (playlistItem) => {
        axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${playlistItem.name}%20${playlistItem.artists[0].name}&key=${process.env.YOUTUBE_API_KEY}`
        ).then(( youtubeApiResponse ) => {
          musicQueue.enqueue({
            musicTitle: playlistItem.name,
            musicId: youtubeApiResponse.data.items[0].id.videoId,
            uploader: playlistItem.artists[0].name,
            originalURL: playlistItem.track.external_urls.spotify,
          });
        });
      });
      playlistItems = playlistItems.data.next === null 
        ? undefined
        : await axios.get(playlistItems.data.next, {
          headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`,
            'Content-Type': 'application/json',
          }
        });
    } while (playlistItems !== null);

    embed.setTitle(`${spotifyPlaylistInfo.data.name}`)
      .setDescription(`Enqueued ${spotifyPlaylistInfo.data.tracks.total} songs to the queue`)
      .setURL(urlStr)
      .setTimestamp();
  } else if (pathname.includes('/track/')) {
    const trackId = pathname.slice(pathname.lastIndexOf('/') + 1);
    const spotifyTrackInfo: AxiosResponse<any, any> | undefined = 
    await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${spotifyAccessToken}`,
        'Content-Type': 'application/json',
      }
    }).catch(() => {
      return undefined;
    });
  
    if (!spotifyTrackInfo) return musicQueueLength;

    const youtubeVideoInfo =
      await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${spotifyTrackInfo.data.album.name}%20${spotifyTrackInfo.data.album.artists[0].name}&key=${process.env.YOUTUBE_API_KEY}`
      );

    musicQueue.enqueue({
      musicTitle: spotifyTrackInfo.data.album.name,
      musicId: youtubeVideoInfo.data.items[0].id.videoId,
      uploader: spotifyTrackInfo.data.album.artists[0].name,
      originalURL: urlStr,
    });
    embed.setTitle(musicQueue.getLength() > 1 ? 'Added to Queue' : 'Now Playing')
      .setDescription(spotifyTrackInfo.data.album.name)
      .setURL(urlStr)
      .setTimestamp();
  }

  return musicQueue.getLength();
}

export const getAndEnqueueYouTubeVideoInfoFromNonURLQueryAndUpdateEmbed = async (
  query: string, 
  embed: EmbedBuilder
): Promise<number> => {
  try {
    const videoInfo = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${process.env.YOUTUBE_API_KEY}`)
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

    return newQueueLength;
  } catch (error) {
    if (error.response) {
      throw new Error(failedYouTubeMusicQueryErrorStr);
    } else if (error.request) {
      throw new Error(error.message);
    }
    throw error;
  }

}
