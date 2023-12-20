import axios, { AxiosResponse } from "axios";
import { PlaylistItem } from "../../../types/playlistItem";
import { URL } from 'url';

// TODO check erroneous inputs invalid url

const invalidURLError = 'Invalid URL';
const invalidYouTubePlaylistIDErrorStr = 
  'No YouTube playlist found associated with the id in the URL';
const emptyYouTubePlaylistURLErrorStr = 'Empty YouTube playlist URL';
const apiErrorStr = 'YouTube api error';

export const createPlaylistItemsArrayFromYouTubePlaylist = async (youtubePlaylistURL: string) => {
  const playlistId = new URL(youtubePlaylistURL).searchParams.get('list');
  const playlistItemArray: Array<PlaylistItem> = [];
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
    playlistItems.data.items.forEach((playlistItem) => {
      const musicId = playlistItem.snippet.resourceId.videoId;
      playlistItemArray.push({
        musicTitle: playlistItem.snippet.title,
        musicId: musicId,
        uploader: playlistItem.snippet.channelTitle,
        originalURL: `https://www.youtube.com/watch?v=${musicId}&list=${playlistId}`,
        dateCreated: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
    });

    const nextPageToken = playlistItems.data.nextPageToken;
    playlistItems = nextPageToken !== undefined ? await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&pageToken=${nextPageToken}&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
    ) : undefined;
  }

  return playlistItemArray;
}

export const getYouTubePlaylistNameAndItemCount = async (youtubePlaylistURL: string) => {
  if (!URL.canParse(youtubePlaylistURL)) {
    throw new Error(invalidURLError);
  }
  const playlistId = new URL(youtubePlaylistURL).searchParams.get('list');
  const playlistInfoRequestResult = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
  )

  return {
    playlistName: playlistInfoRequestResult.data.items[0].snippet.title as string,
    itemCount: playlistInfoRequestResult.data.items[0].contentDetails.itemCount as number
  };
}