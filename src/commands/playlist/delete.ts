import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistDelete = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;

  try {
    const result = await db.query(
      'SELECT * FROM playlist WHERE playlistName = ? AND userId = ?', 
      [playlistName, memberId]
    );

    if (result.length === 0) {
      embed.setTitle('Playlist')
        .setDescription(`No playlist with name ${playlistName} belonging to ${userMention(memberId)} exists`)
        .setTimestamp();
      interaction.reply({ content: '', components: [], embeds: [embed] })
    } else {
      await db.query('DELETE FROM playlist WHERE playlistName = ? AND userId = ?', [playlistName, memberId])
      embed.setTitle('Playlist')
        .setDescription(`Successfully deleted playlist "${playlistName}" belonging to ${userMention(memberId)}`)
        .setTimestamp();
      await interaction.reply({ content: '', components: [], embeds: [embed] });
    }
  } catch (error) {
    embed.setTitle('Error')
      .setDescription('An error occurred while deleting a playlist.')
      .setTimestamp();
    console.error(`Playlist delete subcommand error: ${error}`);
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
  }
}