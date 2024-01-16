import { CacheType, ChatInputCommandInteraction, EmbedBuilder, userMention } from 'discord.js';
import { createPlaylistItemsArrayFromYouTubePlaylist, getYouTubePlaylistNameAndItemCount } from './utils/import';
import * as db from '../../utils/database';

export const executePlaylistImport = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const targetPlaylistName = interaction.options.get('name').value as string;
  const url = interaction.options.get('url').value as string;
  const playlistInfo = await getYouTubePlaylistNameAndItemCount(url);
  const playlistItems = await createPlaylistItemsArrayFromYouTubePlaylist(url);

  var initialSizeOfPlaylist = await getNumberOfPlaylistItems(memberId, targetPlaylistName);

  await db.query('START TRANSACTION');

  try {
    const result = await db.query(
      `SELECT * FROM playlist WHERE playlistName = ? AND userId = ?`,
      [targetPlaylistName, memberId]
    );

    if (playlistItems.length === 0) {
      embed.setTitle('Playlist')
        .setDescription('External playlist specified is empty.')
        .setTimestamp();
      return await interaction.reply({ content: '', components: [], embeds: [embed] });
    }

    if (result.length === 0) {
      await db.query(
        'INSERT INTO playlist (playlistName, userId) VALUES (?, ?)',
        [targetPlaylistName, memberId]
      );
    }

    for (const playlistItem of playlistItems) {
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
        [result[0].playlistItemId, memberId, targetPlaylistName, initialSizeOfPlaylist + playlistItems.indexOf(playlistItem) + 1]
      );
    };

    embed.setTitle('Import')
      .setDescription(
        `${playlistInfo.itemCount} items from YouTube playlist "${playlistInfo.playlistName}" appended to playlist "${targetPlaylistName}" belonging to ${userMention(memberId)}`
      )
      .setTimestamp();
    await db.query('COMMIT');
    return await interaction.reply({ content: '', components: [], embeds: [embed] });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(`Transaction error: ${error}`);
    embed.setTitle('Error')
      .setDescription('An error occurred while importing a playlist.')
      .setTimestamp();
    return await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
  }
}

const getNumberOfPlaylistItems = async (memberId: string, playlistName: string): Promise<number> => {
  const queryResult = await db.query(
    `SELECT COUNT(*) AS itemCount FROM playlist_content_map WHERE userId = ? AND playlistName = ?`,
    [memberId, playlistName]
  );
  return queryResult[0].itemCount as number;
}