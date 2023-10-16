import { CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import * as db from '../../../utils/database';

// 'SELECT * FROM playlist_items WHERE id IN (SELECT playlistItemID FROM playlist_content_map WHERE playlistID IN (SELECT playlistID FROM playlist WHERE userID = ?)) ORDER BY dateCreated'

export const executePlaylistView = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  embed.setTitle('Playlist');

  await db.query(
    'SELECT playlistID, playlistName, COUNT(*) AS \'count\' FROM playlist WHERE userID = ? INNER JOIN playlist_content_map USING (playlistId) ORDER BY playlistName', 
    [memberId],
  ).then((result) => {
    if (result.length === 0) {
      embed.setTitle('Playlist')
        .setDescription('No items found')
        .setTimestamp();
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }
    embed.setDescription(`Found ${result.length} playlists belonging to ${interaction.member.user.username}`);
    result.forEach((row, index) => {
      embed.addFields({
        name: `${index + 1}.`,
        value: `${row.playlistName} (${row.count} songs)`
      });
    });
    embed.setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  });
}