import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';
import { musicQueue } from "../../queue/musicQueue";
import { MusicPlayer } from "../../musicplayer/MusicPlayer";

export const executePlaylistLoadToQueue = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

  try {
    const queryResult = await db.query(
      'SELECT * FROM playlist WHERE userId = ? AND playlistName = ?',
      [memberId, playlistName]
    );

    if (queryResult.length === 0) {
      embed.setTitle('Error')
        .setDescription(`No playlist with name "${playlistName}" belonging to ${userMention(memberId)} exists.`)
        .setTimestamp();
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }

    const musicQueueOldLength = musicQueue.getLength();

    if (await loadPlaylistToQueue(embed, memberId, playlistName)) {
      if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio())
        musicPlayerInstance.playAudio();

      embed.setTitle('Playlist')
        .setDescription(`Content of playlist "${playlistName}" successfully appended to queue.`)
        .setTimestamp();
    }

    return interaction.reply({ content: '', components: [], embeds: [embed] })
  } catch (error) {
    console.error(`Playlist load to queue error: ${error}`);
    embed.setTitle('Error')
      .setDescription('An error occurred while loading the playlist to queue')
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
  }
}

const loadPlaylistToQueue = async (
  embed: EmbedBuilder,
  memberId: string, 
  playlistName: string
) => {
  const result = await db.query(
    'SELECT pi.title, pi.uploader, pi.musicId, pi.originalURL FROM playlist_items AS pi INNER JOIN playlist_content_map AS pcm ON (pi.playlistItemId = pcm.playlistItemId) INNER JOIN playlist AS p ON (pcm.playlistName = p.playlistName AND pcm.userId = p.userId) WHERE p.userId = ? AND p.playlistName = ? ORDER BY pcm.playlistPosition',
    [memberId, playlistName]
  );
  if (result.length === 0) {
    embed.setTitle('Error')
      .setDescription(`Playlist "${playlistName}" has no content to append to the queue`)
      .setTimestamp();
    return false;
  }
  result.forEach((playlistItem) => {
    musicQueue.enqueue({
      musicTitle: playlistItem.title,
      musicId: playlistItem.musicId,
      uploader: playlistItem.uploader,
      originalURL: playlistItem.originalURL,
    }, memberId);
  });
  return true;
}