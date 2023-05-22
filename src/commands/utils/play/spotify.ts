import axios from "axios";
import { musicQueue } from "../../../queue/musicQueue";
import { EmbedBuilder } from "discord.js";

const spotifyAccessToken = process.env['SPOTIFY_ACCESS_TOKEN'];
const emptySpotifyPlaylistErrorStr = 'Unable to enqueue: empty spotify playlist.';

// BUG: audio resource does not start playing after spotify playlist items enqueued

export const enqueueSpotifyPlaylistRequest = async (
  url: string, 
  embed: EmbedBuilder
) => {
  const pathname = new URL(url).pathname;
  const playlistId = pathname.slice(pathname.lastIndexOf('/') + 1);

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
      await enqueueSpotifyPlaylistItems(playlistId);
      embed
        .setTitle(`${spotifyPlaylistInfo.data.name}`)
        .setDescription(`Enqueued ${spotifyPlaylistInfo.data.tracks.total} songs to the queue`)
        .setURL(url)
        .setTimestamp();
    })
    .catch((error) => {
      if (error.status === '404') {
        throw new Error('Invalid Spotify playlist id');
      }
      throw new Error(error.message);
    });
}

export const enqueueSpotifyTrackRequest = async (url: string, embed: EmbedBuilder) => {
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
  });

  embed
    .setTitle(musicQueue.getLength() > 1 ? 'Added to Queue' : 'Now Playing')
    .setDescription(
      `${spotifyTrackInfo.data.album.artists[0].name} - ${spotifyTrackInfo.data.name}`
    )
    .setURL(url)
    .setTimestamp();
}

const enqueueSpotifyPlaylistItems = async (playlistId: string) => {
  var playlistItems = await axios
    .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${spotifyAccessToken}`,
        'Content-Type': 'application/json',
      }
    })
    .catch(error => {
      throw new Error(`${error.status} - ${error.message}`);
    });

  do {
    playlistItems.data.items.forEach(async (playlistItem) => {
      await axios
        .get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${playlistItem.track.name}%20${playlistItem.track.artists[0].name}&key=${process.env.YOUTUBE_API_KEY}`
        )
        .then(( youtubeApiResponse ) => {
          musicQueue.enqueue({
            musicTitle: playlistItem.track.name,
            musicId: youtubeApiResponse.data.items[0].id.videoId,
            uploader: playlistItem.track.artists[0].name,
            originalURL: playlistItem.track.external_urls.spotify,
          });
        })
        .catch((error) => {
          console.error(error);
          throw new Error(
            `Failed to get song ${playlistItem.track.name} ${playlistItem.track.artists[0].name} from playlist. Please try the command again`
          );
        });
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
          .catch((error) => {
            console.log(error);
            throw new Error(
              'Failed to get next page of spotify playlist items. Please try command again.'
            );
          });
  } while (playlistItems !== undefined);
}