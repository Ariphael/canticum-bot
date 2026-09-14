import axios from "axios";
import { PlaylistItem } from "../../../types/playlistItem";

const youtubeURLRegExp = 
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

const invalidYouTubeVideoURLErrorStr = 
  'No YouTube music can be found associated with the id in the URL';
const failedYouTubeMusicQueryErrorStr = 'No song found associated with query';
const apiErrorStr = 'YouTube API error';

export const createPlaylistItem = async (query: string, memberId: string) => {
  const isQueryYouTubeURL = youtubeURLRegExp.test(query);

  return isQueryYouTubeURL 
    ? await createPlaylistItemURLQuery(query, memberId) 
    : await createPlaylistItemNonURLQuery(query, memberId);
}

const createPlaylistItemURLQuery = async (url: string, memberId: string): Promise<PlaylistItem> => {
  const musicId = new URL(url).searchParams.get('v');

  try {
    const videoInfo = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${musicId}&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`
    )
      .then(apiResponse => apiResponse.data);
    return {
      musicTitle: videoInfo.items[0].snippet.title,
      musicId: musicId,
      uploader: videoInfo.items[0].snippet.channelTitle,
      originalURL: url,  
      dateCreated: new Date().toISOString().slice(0, 19).replace('T', ' '),
      enqueuerMemberId: memberId,
    };
  } catch (reason) {
    if (reason.response) {
      throw new Error(invalidYouTubeVideoURLErrorStr);
    } else if (reason.request) {
      throw new Error(apiErrorStr);
    }
    throw new Error(reason.message);
  }
}

const createPlaylistItemNonURLQuery = async (nonURLQuery: string, memberId: string): Promise<PlaylistItem> => {
  try {
    return await axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${nonURLQuery}&key=${process.env.YOUTUBE_API_KEY}`
      )
      .then(({ data: { items } }) => {
        return items.length > 0 ? {
          musicTitle: items[0].snippet.title,
          musicId: items[0].id.videoId,
          uploader: items[0].snippet.channelTitle,
          originalURL: `https://www.youtube.com/watch?v=${items[0].id.videoId}`,
          dateCreated: new Date().toISOString().slice(0, 19).replace('T', ' '),
          enqueuerMemberId: memberId,
        } : undefined;
      });
  } catch (error) {
    if (error.response) {
      throw new Error(failedYouTubeMusicQueryErrorStr);
    } else if (error.request) {
      throw new Error(error.message);
    }
    throw error;
  }
}