import axios, { AxiosResponse } from "axios";
import { musicQueue } from "../../../queue/musicQueue";
import { EmbedBuilder } from "discord.js";

const invalidYouTubePlaylistIDErrorStr = 
  'No YouTube playlist found associated with the id in the URL';
const emptyYouTubePlaylistURLErrorStr = 'Empty YouTube playlist URL';
const invalidYouTubeVideoURLErrorStr = 
  'No YouTube music can be found associated with the id in the URL';
const playlistForbiddenErrorStr = 'Playlist identified forbids access';
const apiErrorStr = 'YouTube API error';

export const enqueueYouTubePlaylistRequest = async (url: string, embed: EmbedBuilder): Promise<EmbedBuilder> => {
  const playlistId = new URL(url).searchParams.get('list');
  var playlistItems: AxiosResponse<any, any>;

  try {
    playlistItems = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    );
  } catch (reason) {
    if (reason.request) throw new Error(apiErrorStr);
    else if (reason.response) {
      throw new Error(invalidYouTubePlaylistIDErrorStr);
    }
    throw new Error(reason.message);
  }

  if (playlistItems.data.items.length === 0) {
    throw new Error(emptyYouTubePlaylistURLErrorStr);
  }

  while (playlistItems !== undefined) {
    enqueuePlaylistItems(playlistItems, playlistId);
    const nextPageToken = playlistItems.data.nextPageToken;
    playlistItems = nextPageToken !== undefined ? await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&pageToken=${nextPageToken}&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    ) : undefined;
  }

  try {
    const playlistInfo = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    )
      .then(apiResponse => apiResponse.data.items[0]);
    return embed
      .setTitle(`${playlistInfo.snippet.localized.title}`)
      .setDescription(`Enqueued ${playlistInfo.contentDetails.itemCount} songs to the queue`)
      .setURL(url)
      .setTimestamp();
  } catch (reason) {
    if (reason.request) throw new Error(apiErrorStr);
    else if (reason.response) {
      // As we are not sending a request using the channelId parameter, a 403 error should only be
      // resultant from a playlist identified that does not support the request.
      if (reason.response.error.code === 403) throw new Error(playlistForbiddenErrorStr);
      throw new Error(`Error: ${reason.response.error.message}`);
    }
    throw new Error(reason.message);
  }
}

export const enqueueYouTubeSongRequest = async (url: string, embed: EmbedBuilder): Promise<EmbedBuilder> => {
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
  } catch (reason) {
    if (reason.response) {
      throw new Error(invalidYouTubeVideoURLErrorStr);
    } else if (reason.request) {
      throw new Error(apiErrorStr);
    }
    throw new Error(reason.message);
  }
  return embed;
}

const enqueuePlaylistItems = (playlistItems: AxiosResponse<any, any>, playlistId: string) => {
  playlistItems.data.items.forEach(playlistItem => {
    const musicId = playlistItem.snippet.resourceId.videoId;
    musicQueue.enqueue({
      musicTitle: playlistItem.snippet.title,
      musicId: musicId,
      uploader: playlistItem.snippet.channelTitle,
      originalURL: `https://www.youtube.com/watch?v=${musicId}&list=${playlistId}`
    });
  });
}