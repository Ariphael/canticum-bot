import { CacheType, ChatInputCommandInteraction, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistView = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;

  const result = await db.query(
    'SELECT playlistName, COUNT(playlistItemId) AS \'count\' FROM playlist AS p LEFT JOIN playlist_content_map AS pcm USING (playlistName) WHERE p.userId = ? GROUP BY playlistName', 
    [memberId],
  );

  if (result.length === 0) {
    embed.setTitle('Playlist')
      .setDescription('No items found')
      .setTimestamp();
    return interaction.reply({ content: '', components: [], embeds: [embed] });
  }
  embed.setTitle('Playlist')
    .setDescription(
      `${result.length} playlist${result.length > 1 ? 's' : ''} belonging to ${userMention(memberId)}:`
    )
    .setTimestamp();

  result.forEach((row, index) => {
    embed.addFields({
      name: `${index + 1}.`,
      value: `${row.playlistName} (${row.count})`
    });
  });

  return interaction.reply({ content: '', components: [], embeds: [embed] });
}