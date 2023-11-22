import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../../utils/database';
import { musicQueue } from "../../../queue/musicQueue";
import { MusicPlayer } from "../../../musicplayer/MusicPlayer";

export const executePlaylistLoadToQueue = (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();

  db.query(
    'SELECT * FROM playlist WHERE userId = ? AND playlistName = ?', 
    [memberId, playlistName]
  ).then((result) => {
    if (result.length === 0) {
      embed.setTitle('Error')
        .setDescription(`Playlist with name "${playlistName}" belonging to ${userMention(memberId)} does not exist.`)
        .setTimestamp();
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }

    const musicQueueOldLength = musicQueue.getLength();
    loadPlaylistToQueue(interaction, embed, memberId, playlistName).then(_ => {
      if (musicQueueOldLength === 0 && !musicPlayerInstance.isPlayingAudio())
        musicPlayerInstance.playAudio();
    });
  });
}

const loadPlaylistToQueue = (
  interaction: ChatInputCommandInteraction<CacheType>, 
  embed: EmbedBuilder, 
  memberId: string, 
  playlistName: string
) => {
  return db.query(
    'SELECT pi.title, pi.uploader, pi.musicId, pi.originalURL FROM playlist_items AS pi INNER JOIN playlist_content_map AS pcm ON (pi.playlistItemId = pcm.playlistItemId) INNER JOIN playlist AS p ON (pcm.playlistName = p.playlistName AND pcm.userId = p.userId) WHERE p.userId = ? AND p.playlistName = ? ORDER BY pcm.playlistPosition',
    [memberId, playlistName]
  ).then((result) => {
    if (result.length === 0) {
      embed.setTitle('Error')
        .setDescription(`Playlist "${playlistName}" has no content to append to the queue`)
        .setTimestamp();
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }
    result.forEach((playlistItem) => {
      musicQueue.enqueue({
        musicTitle: playlistItem.title,
        musicId: playlistItem.musicId,
        uploader: playlistItem.uploader,
        originalURL: playlistItem.originalURL,
      })
    });
    embed.setTitle('Playlist')
      .setDescription(
        `Content of playlist "${playlistName}" has been appended to the queue. Use /queue to see current state of queue.`
      )
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  })
}