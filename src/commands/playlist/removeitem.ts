import { CacheType, ChatInputCommandInteraction, EmbedBuilder, userMention } from 'discord.js';
import * as db from '../../utils/database';

export const executePlaylistRemoveItem = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const positionInPlaylist = interaction.options.get('position').value as number;

  const numberOfPlaylistItemsQueryResult = await db.query(
    `SELECT COUNT(*) AS itemCount FROM playlist_content_map WHERE userId = ? AND playlistName = ?`,
    [memberId, playlistName]);
  const numberOfPlaylistItems = numberOfPlaylistItemsQueryResult[0].itemCount;

  if (numberOfPlaylistItems < positionInPlaylist || positionInPlaylist < 1) {
    embed.setTitle('Error')
      .setDescription('Invalid position value')
      .setTimestamp();
    return await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
  }

  const result = await db.query(
    `SELECT * FROM playlist WHERE playlistName = ? AND userId = ?`,
    [playlistName, memberId]
  );

  if (result.length === 0) {
    embed.setTitle('Error')
    .setDescription(`No playlist with name "${playlistName}" belonging to ${userMention(memberId)} was found.`)
    .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });     
  }

  const playlistItemTitle = await removeItemAndUpdatePositionsInDB(memberId, playlistName, positionInPlaylist);
  embed.setTitle('Playlist')
    .setDescription(`Removed ${playlistItemTitle} from position ${positionInPlaylist} of playlist ${playlistName}`)
    .setTimestamp();
  return interaction.reply({ content: '', components: [], embeds: [embed] });
}

const removeItemAndUpdatePositionsInDB = async (memberId: string, playlistName: string, positionInPlaylist: number) => {
  const result = await db.query(
    `SELECT title FROM playlist_items INNER JOIN playlist_content_map USING (playlistItemId) WHERE userId = ? AND playlistName = ? AND playlistPosition = ?`,
    [memberId, playlistName, positionInPlaylist]
  );
  
  const itemTitle = result[0].title as string;
  db.query(
    `DELETE FROM playlist_content_map WHERE userId = ? AND playlistName = ? AND playlistPosition = ?`,
    [memberId, playlistName, positionInPlaylist]
  );

  db.query(
    `UPDATE playlist_content_map SET playlistPosition = playlistPosition - 1 WHERE userId = ? AND playlistName = ? AND playlistPosition > ?`,
    [memberId, playlistName, positionInPlaylist]
  );
}