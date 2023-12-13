import { CacheType, ChatInputCommandInteraction, EmbedBuilder, userMention } from 'discord.js';
import { createPlaylistItemsArrayFromYouTubePlaylist, getYouTubePlaylistNameAndItemCount } from './utils/import';
import * as db from '../../utils/database';

export const executePlaylistImport = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const targetPlaylistName = interaction.options.get('name').value as string;
  const url = interaction.options.get('url').value as string;
  const playlistInfo = await getYouTubePlaylistNameAndItemCount(url);
  const playlistItems = await createPlaylistItemsArrayFromYouTubePlaylist(url);

  var nextPositionInPlaylist = await getNumberOfPlaylistItems(memberId, targetPlaylistName) + 1;

  const result = await db.query(
    `SELECT * FROM playlist WHERE playlistName = ? AND userId = ?`,
    [targetPlaylistName, memberId]
  );

  if (result.length === 0) {
    embed.setTitle('Error')
      .setDescription(`No playlist with name "${targetPlaylistName}" belonging to ${userMention(memberId)} exists.`)
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  }

  playlistItems.forEach(async (playlistItem) => {
    await db.query(
      `INSERT INTO playlist_items (title, uploader, musicId, originalURL, dateCreated) VALUES (?, ?, ?, ? ,?)`,
      [playlistItem.musicTitle, playlistItem.uploader, playlistItem.musicId, 
        playlistItem.originalURL, playlistItem.dateCreated]
    );

    const result = await db.query(
      'SELECT playlistItemId FROM playlist_items WHERE title = ? AND uploader = ? AND musicId = ? AND originalURL = ?',
      [playlistItem.musicTitle, playlistItem.uploader, playlistItem.musicId, 
        playlistItem.originalURL]
    );

    await db.query(
      'INSERT INTO playlist_content_map (playlistItemId, userId, playlistName, playlistPosition) VALUES (?, ?, ?, ?)',
      [result[0].playlistItemId, memberId, targetPlaylistName, nextPositionInPlaylist]
    );
    nextPositionInPlaylist++;

    embed.setTitle('Import')
      .setDescription(
        `${playlistInfo.itemCount} items from YouTube playlist "${playlistInfo.playlistName}" appended to playlist "${targetPlaylistName}" belonging to ${userMention(memberId)}`
      )
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  });
}

const getNumberOfPlaylistItems = async (memberId: string, playlistName: string): Promise<number> => {
  const queryResult = await db.query(
    `SELECT COUNT(*) AS itemCount FROM playlist_content_map WHERE userId = ? AND playlistName = ?`,
    [memberId, playlistName]
  );
  return queryResult[0].itemCount as number;
}