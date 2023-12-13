import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistCreate = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;

  embed.setTitle('Playlist');

  const result = await db.query('SELECT * FROM playlist WHERE playlistName = ? AND userId = ?', [playlistName, memberId]);

  if (result.length === 0) {
    db.query(
      'INSERT INTO playlist (playlistName, userId) VALUES (?, ?)',
      [playlistName, memberId]
    ).then(_ => {
      embed.setDescription(`Successfully created playlist ${playlistName}`)
        .setTimestamp();
      interaction.reply({ content: '', components: [], embeds: [embed] });
    });
  } else {
    embed.setDescription(
      `Playlist with name "${playlistName}" belonging to ${userMention(memberId)} already exists`
    )
      .setTimestamp();
    interaction.reply({ content: '', components: [], embeds: [embed] });
  }
}