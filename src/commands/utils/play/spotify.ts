import axios from "axios";
import { musicQueue } from "../../../queue/musicQueue";
import { EmbedBuilder } from "discord.js";

const spotifyAccessToken = process.env['SPOTIFY_ACCESS_TOKEN'];
const emptySpotifyPlaylistErrorStr = 'Spotify playlist is empty';
const emptySpotifyAlbumErrorStr = 'Spotify album is empty';
const spotifyApiErrorStr = 'Spotify API did not respond';
const maxNoAttemptsItemFetch = 2;

export const enqueueSpotifyPlaylistRequest = async (url: string, embed: EmbedBuilder, memberId: string): Promise<EmbedBuilder> => {
  const pathname = new URL(url).pathname;
  const playlistId = pathname.slice(pathname.lastIndexOf('/') + 1);

  try {
    await axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(async (spotifyPlaylistInfo) => {
        if (spotifyPlaylistInfo.data.tracks.total === 0) 
          throw new Error(emptySpotifyPlaylistErrorStr);
        await enqueueSpotifyPlaylistItems(playlistId, memberId);
        embed
          .setTitle(`${spotifyPlaylistInfo.data.name}`)
          .setDescription(`Enqueued ${spotifyPlaylistInfo.data.tracks.total} songs to the queue`)
          .setURL(url)
          .setTimestamp();
      });
  } catch (error) {
    if (error.status === '404') {
      throw new Error('Invalid Spotify playlist id');
    }
    throw new Error(error.message);
  }
  return embed;
}

export const enqueueSpotifyAlbumRequest = async (url: string, embed: EmbedBuilder, memberId: string) => {
  const pathname = new URL(url).pathname;
  const albumId = pathname.slice(pathname.lastIndexOf('/') + 1);

  try {
    await axios
      .get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(async (spotifyAlbumInfo) => {
        if (spotifyAlbumInfo.data.tracks.total === 0)
          throw new Error(emptySpotifyAlbumErrorStr);
        await enqueueSpotifyAlbumItems(spotifyAlbumInfo.data.id, memberId);
        embed
          .setTitle(`${spotifyAlbumInfo.data.name}`)
          .setDescription(`Enqueued ${spotifyAlbumInfo.data.tracks.total} songs to the queue`)
          .setURL(url)
          .setTimestamp();
      });
  } catch (reason) {
    if (reason.request) throw new Error(spotifyApiErrorStr);
    throw new Error(`${reason.response.error.status} - ${reason.response.error.message}`);
  }

  return embed;
}

export const enqueueSpotifyTrackRequest = async (url: string, embed: EmbedBuilder, memberId: string): Promise<EmbedBuilder> => {
  const pathname = new URL(url).pathname;
  const trackId = pathname.slice(pathname.lastIndexOf('/') + 1);

  const spotifyTrackInfo = await axios
    .get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${spotifyAccessToken}`,
      }
    })
    .catch((reason) => {
      throw new Error(`${reason.response.error.status} - ${reason.response.error.message}`);
    });

  const youtubeVideoInfo = await axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${spotifyTrackInfo.data.name}%20${spotifyTrackInfo.data.album.artists[0].name}&key=${process.env.YOUTUBE_API_KEY}`
    )
    .catch((error) => {
      throw new Error(`${error.status} - ${error.message}`);
    });

  musicQueue.enqueue({
    musicTitle: spotifyTrackInfo.data.name,
    musicId: youtubeVideoInfo.data.items[0].id.videoId,
    uploader: spotifyTrackInfo.data.album.artists[0].name,
    originalURL: url,
    enqueuerMemberId: memberId,
    enqueueTimestamp: Date.now(),
  }, memberId);

  return embed
    .setTitle(musicQueue.getLength() > 1 ? 'Added to Queue' : 'Now Playing')
    .setDescription(
      `${spotifyTrackInfo.data.album.artists[0].name} - ${spotifyTrackInfo.data.name}`
    )
    .setURL(url)
    .setTimestamp();
}

const enqueueSpotifyPlaylistItems = async (playlistId: string, memberId: string) => {
  try {
    var playlistItems = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
          'Content-Type': 'application/json',
        }
      });
  } catch (error) {
    if (error.request) throw new Error(spotifyApiErrorStr);
    else if (error.response) throw new Error(`${error.status} - ${error.message}`);
    throw new Error(error.message);
  }

  do {
    playlistItems.data.items.forEach(async (playlistItem) => {
      await enqueueSpotifyPlaylistItem(playlistItem, memberId);
    });
    playlistItems = playlistItems.data.next === null 
      ? undefined
      : await axios
          .get(playlistItems.data.next, {
            headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`,
            'Content-Type': 'application/json',
            }
          })
          .catch(() => {
            throw new Error(
              'Failed to get next page of spotify playlist. Please try command again.'
            );
          });
  } while (playlistItems !== undefined);
}

const enqueueSpotifyPlaylistItem = async (playlistItem, memberId: string) => {
  await doEnqueueSpotifyPlaylistItem(playlistItem, memberId, 0);
}

const doEnqueueSpotifyPlaylistItem = async (playlistItem, memberId: string, attempt: number) => {
  try {
    // this is EXPENSIVE...
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${playlistItem.track.name}%20-%20${playlistItem.track.artists[0].name}%20Lyrics&key=${process.env.YOUTUBE_API_KEY}`
      )
      .then(( youtubeApiResponse ) => {
        musicQueue.enqueue({
          musicTitle: playlistItem.track.name,
          musicId: youtubeApiResponse.data.items[0].id.videoId,
          uploader: playlistItem.track.artists[0].name,
          originalURL: playlistItem.track.external_urls.spotify,
          enqueuerMemberId: memberId,
          enqueueTimestamp: Date.now(),
        }, memberId);
      });
  } catch (error) {
    if (attempt === maxNoAttemptsItemFetch) 
      throw new Error(
        `Failed to get song ${playlistItem.track.name} ${playlistItem.track.artists[0].name} from playlist. Please try the command again`
      );
    await doEnqueueSpotifyPlaylistItem(playlistItem, memberId, attempt + 1);
  }
}

const enqueueSpotifyAlbumItems = async (albumId: string, memberId: string) => {
  try {
    var albumItems = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/track`, {
      headers: {
        'Authorization': `Bearer ${spotifyAccessToken}`,
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    if (error.request) throw new Error(spotifyApiErrorStr);
    else if (error.response) throw new Error(`${error.status} - ${error.message}`);
    throw new Error(error.message);    
  }

  do {
    const next = albumItems.data.next;
    albumItems.data.items.forEach(async (albumTrack) => {
      await enqueueSpotifyAlbumItem(albumTrack, memberId);
    });
    albumItems = next === null
      ? undefined
      : await axios
          .get(albumItems.data.next, {
            headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`,
            'Content-Type': 'application/json',
            }
          })
          .catch(() => {
            throw new Error(
              'Failed to get next page of spotify album. Please try command again.'
            );
          });

  } while (albumItems !== null);
}

const enqueueSpotifyAlbumItem = async (albumItem, memberId: string) => {
  await doEnqueueSpotifyAlbumItem(albumItem, memberId, 0);
}

const doEnqueueSpotifyAlbumItem = async (albumItem, memberId: string, attempt: number) => {
  try {
    // this is also EXPENSIVE....
    await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${albumItem.name}%20-%20${albumItem.artists[0].name}%20Lyrics&key=${process.env.YOUTUBE_API_KEY}`
      )
      .then(youtubeApiResponse => {
        musicQueue.enqueue({
          musicTitle: albumItem.name,
          musicId: youtubeApiResponse.data.items[0].id.videoId,
          uploader: albumItem.artists[0].name,
          originalURL: albumItem.external_urls.spotify,
          enqueuerMemberId: memberId,
          enqueueTimestamp: Date.now(),
        }, memberId);      
      })
  } catch (error) {
    if (attempt === maxNoAttemptsItemFetch) 
      throw new Error(
        `Failed to get song ${albumItem.name} ${albumItem.artists[0].name} from playlist. Please try the command again`
      );
    await doEnqueueSpotifyAlbumItem(albumItem, memberId, attempt + 1);    
  }
}