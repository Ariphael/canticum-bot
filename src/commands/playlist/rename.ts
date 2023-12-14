import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention, ApplicationCommandOptionWithChoicesAndAutocompleteMixin } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistRename = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const newPlaylistName = interaction.options.get('newname').value as string;

  try {
    await db.query('START TRANSACTION');
    const result = await db.query(
      `SELECT * FROM playlist WHERE playlistName = ? AND userId = ?`, 
      [playlistName, memberId]
    );
  
    if (result.length === 0) {
      embed.setTitle('Error')
        .setDescription(`No such playlist with name "${playlistName}" belonging to ${userMention(memberId)} exists`);
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }
  
    await db.query(
      'INSERT INTO playlist (playlistName, userId) VALUES (?, ?)', 
      [newPlaylistName, memberId]
    )
  
    await db.query(
      'UPDATE playlist_content_map SET playlistName = ? WHERE playlistName = ? AND userId = ?', 
      [newPlaylistName, playlistName, memberId]
    );
  
    await db.query(
      `DELETE FROM playlist WHERE playlistName = ?`,
      [playlistName]
    );

    await db.query('COMMIT');

    embed.setTitle('Playlist')
      .setDescription(
        `Successfully renamed playlist "${playlistName}" belonging to ${userMention(memberId)} to "${newPlaylistName}"`
      )
      .setTimestamp();
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(`Transaction failed: ${error}`);
    embed.setTitle('Error')
      .setDescription('An error occurred while renaming the playlist')
      .setTimestamp();
  }

  return interaction.reply({ content: '', components: [], embeds: [embed] });
}