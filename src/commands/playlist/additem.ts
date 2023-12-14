import { CacheType, ChatInputCommandInteraction, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';
import { createPlaylistItem } from "./utils/item";
import { PlaylistItem } from "../../types/playlistItem";

export const executePlaylistAddItem = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const query = interaction.options.get('query').value as string;
  const playlistItemCount = await getNumberOfPlaylistItems(memberId, playlistName);
  const positionInPlaylist = interaction.options.get('position') === null
    ? playlistItemCount + 1
    : Math.min(playlistItemCount, interaction.options.get('position').value as number);

  const result = await db.query(
    'SELECT * FROM playlist WHERE playlistName = ? AND userId = ?', 
    [playlistName, memberId]
  );

  if (result.length === 0) {
    embed.setTitle('Error')
      .setDescription(
      `No playlist with name "${playlistName}" belonging to ${userMention(memberId)} exists`
    )
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });        
  }

  try {
    await db.query('START TRANSACTION');
    const playlistItem = await createPlaylistItem(query);
    await insertPlaylistItemIntoDBIfUnique(playlistItem);
    addItemToUserPlaylist(memberId, playlistName, playlistItem, positionInPlaylist);
    embed.setTitle('Playlist')
      .setDescription(
        `Added "${playlistItem.musicTitle}" to playlist "${playlistName}" owned by user ${userMention(memberId)}`
      )
      .setTimestamp();
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(`Transaction error: ${error}`);
    embed.setTitle('Error')
      .setDescription('An error occurred while adding an item to the playlist')
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true })
  }

  return interaction.reply({ content: '', components: [], embeds: [embed] });
}

const addItemToUserPlaylist = async (memberId: string, playlistName: string, playlistItem: PlaylistItem, playlistPosition: number) => {
  if (playlistPosition !== undefined) {
    await db.query(
      `UPDATE playlist_content_map SET playlistPosition = playlistPosition + 1 WHERE userId = ? AND playlistName = ? AND playlistPosition >= ?`,
      [memberId, playlistName, playlistPosition]
    );
  }

  const result = await db.query(
    `SELECT playlistItemId FROM playlist_items WHERE title = ? AND uploader = ? AND originalURL = ?`,
    [playlistItem.musicTitle, playlistItem.uploader, playlistItem.originalURL]
  );

  await db.query(
    `INSERT INTO playlist_content_map (playlistItemId, userId, playlistName, playlistPosition) VALUES (?, ?, ?, ?)`,
    [result[0].playlistItemId, memberId, playlistName, playlistPosition]
  );
}

const getNumberOfPlaylistItems = async (memberId: string, playlistName: string): Promise<number> => {
  const queryResult = await db.query(
    `SELECT COUNT(*) AS itemCount FROM playlist_content_map WHERE userId = ? AND playlistName = ?`,
    [memberId, playlistName]
  );
  return queryResult[0].itemCount as number;
}

const insertPlaylistItemIntoDBIfUnique = async (playlistItem: PlaylistItem) => {
  const result = await db.query(
    `SELECT * FROM playlist_items WHERE title = ? AND uploader = ? AND musicId = ? AND originalURL = ?`,
    [playlistItem.musicTitle, playlistItem.uploader, playlistItem.musicId, playlistItem.originalURL]
  );

  if (result.length === 0) {
    await db.query(
      `INSERT INTO playlist_items (title, uploader, musicId, originalURL, dateCreated) VALUES (?, ?, ?, ?, ?)`,
      [playlistItem.musicTitle, playlistItem.uploader, playlistItem.musicId, playlistItem.originalURL, 
      playlistItem.dateCreated]
    );
  }
}