import * as db from '../../utils/database';
import axios, { AxiosResponse } from 'axios';
import { EmbedBuilder } from 'discord.js';
import { musicQueue } from '../../queue/musicQueue';
import { 
  enqueueSpotifyAlbumRequest, 
  enqueueSpotifyPlaylistRequest, 
  enqueueSpotifyTrackRequest 
} from './play/spotify';
import { enqueueYouTubePlaylistRequest, enqueueYouTubeSongRequest } from './play/youtube';

/*
 * Contains auxiliary function responsible for fetching and enqueuing music from YouTube/Spotify
 */

const youtubeURLRegExp = 
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const spotifyURLRegExp = 
  /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(playlist|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;

const failedYouTubeMusicQueryErrorStr = 'No song found associated with query';

export const enqueueMusicAndBuildEmbed = async (query: string, embed: EmbedBuilder, memberId: string) => {
  const isQueryYouTubeURL = youtubeURLRegExp.test(query);
  const isQuerySpotifyURL = spotifyURLRegExp.test(query);

  return isQueryYouTubeURL
    ? await enqueueMusicYouTube(query, embed, memberId)
    : (isQuerySpotifyURL
      ? await enqueueMusicSpotify(query, embed, memberId)
      : await enqueueMusicYouTubeNonURLQuery(query, embed, memberId));
}

const enqueueMusicYouTube = async (url: string, embed: EmbedBuilder, memberId: string): Promise<EmbedBuilder> => {
  const includesPlaylistId = url.includes('list=');

  if (includesPlaylistId) {
    // do this for enqueueyoutubesongrequest
    return await enqueueYouTubePlaylistRequest(url, embed, memberId);
  } else {
    return await enqueueYouTubeSongRequest(url, embed, memberId);
  }
}

const enqueueMusicSpotify = async (url: string, embed: EmbedBuilder, memberId: string): Promise<EmbedBuilder> => {
  const includesPlaylistId = url.includes('playlist/');
  const includesTrackId = url.includes('track/');
  const includesAlbumId = url.includes('album/');

  if (includesPlaylistId) {
    return await enqueueSpotifyPlaylistRequest(url, embed, memberId);
  } else if (includesTrackId) {
    return await enqueueSpotifyTrackRequest(url, embed, memberId);
  } else if (includesAlbumId) {
    return await enqueueSpotifyAlbumRequest(url, embed, memberId);
  }
}

const enqueueMusicYouTubeNonURLQuery = async (query: string, embed: EmbedBuilder, memberId: string): Promise<EmbedBuilder> => {
  try {
    const videoInfo = await axios
      .get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${process.env.YOUTUBE_API_KEY}`)
      .then(({ data: { items } }) => {
        return items.length > 0 ? {
          musicTitle: items[0].snippet.title,
          musicId: items[0].id.videoId,
          uploader: items[0].snippet.channelTitle,
          originalURL: `https://www.youtube.com/watch?v=${items[0].id.videoId}`,
          enqueuerMemberId: memberId,
          enqueueTimestamp: Date.now(),
        } : undefined;
      });

    const newQueueLength = await musicQueue.enqueue(videoInfo, memberId);

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
