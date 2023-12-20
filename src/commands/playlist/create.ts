import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistCreate = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;

  try {
    const result = await db.query('SELECT * FROM playlist WHERE playlistName = ? AND userId = ?', [playlistName, memberId]);

    if (result.length === 0) {
      await db.query(
        'INSERT INTO playlist (playlistName, userId) VALUES (?, ?)',
        [playlistName, memberId]
      )
      embed.setTitle('Playlist')
        .setDescription(`Successfully created playlist ${playlistName}`)
        .setTimestamp();
      await interaction.reply({ content: '', components: [], embeds: [embed] });
    } else {
      embed.setDescription(
        `Personal playlist with name "${playlistName}" already exists`
      )
        .setTimestamp();
      await interaction.reply({ content: '', components: [], embeds: [embed] });
    }
  } catch (error) {
    embed.setTitle('Error')
      .setDescription('An error occurred while creating a playlist')
      .setTimestamp();
    console.error(`Playlist create subcommand error: ${error}`);
    await interaction.reply({ content: '', components: [], embeds: [embed], ephemeral: true });
  }
}