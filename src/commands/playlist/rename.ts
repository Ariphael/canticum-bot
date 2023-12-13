import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistRename = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const newPlaylistName = interaction.options.get('newname').value as string;

  const result = await db.query(
    `SELECT * FROM playlist WHERE playlistName = ? AND userId = ?`, 
    [playlistName, memberId]
  );

  if (result.length === 0) {
    embed.setTitle('Error')
      .setDescription(`No such playlist with name "${playlistName}" belonging to ${userMention(memberId)} exists`);
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  }

  db.query(
    'INSERT INTO playlist (playlistName, userId) VALUES (?, ?)', 
    [newPlaylistName, memberId]
  )
    
  db.query(
    'UPDATE playlist_content_map SET playlistName = ? WHERE playlistName = ? AND userId = ?', 
    [newPlaylistName, playlistName, memberId]
  );

  db.query(
    `DELETE FROM playlist WHERE playlistName = ?`,
    [playlistName]
  );

  embed.setTitle('Playlist')
    .setDescription(
      `Successfully renamed playlist "${playlistName}" belonging to ${userMention(memberId)} to "${newPlaylistName}"`
    );
  return interaction.reply({ content: '', components: [], embeds: [embed] });
}