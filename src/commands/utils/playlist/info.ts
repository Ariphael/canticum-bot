import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import * as db from '../../../utils/database';

const resultsPerPage = 5;

export const executePlaylistInfo = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;

  await db.query(
    `SELECT * FROM playlist WHERE userId = ? AND playlistName = ?`,
    [memberId, playlistName]
  ).then(async (result) => {
    if (result.length === 0) {
      embed.setTitle('Error')
        .setDescription(`No playlist with name "${playlistName}" was found`);
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }
    await doExecutePlaylistInfo(interaction, embed, memberId, playlistName);
  });
}

const doExecutePlaylistInfo = async (
  interaction: ChatInputCommandInteraction<CacheType>, 
  embed: EmbedBuilder, 
  memberId: string, 
  playlistName: string
) => {
  const pageOption = interaction.options.get('page') 
    ? Math.max(0, (interaction.options.get('page').value as number) - 1)
    : 0;

  await db.query(
    `SELECT title, uploader FROM playlist_items INNER JOIN playlist_content_map AS pcm USING (playlistItemId) INNER JOIN playlist AS p USING (playlistName) WHERE p.userId = ? AND p.playlistName = ? ORDER BY pcm.playlistPosition`,
    [memberId, playlistName]
  ).then((result) => {
    if (result.length === 0) {
      embed.setTitle('Error')
        .setDescription(`Playlist with name "${playlistName}" is empty`);
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }

    const resultsMaxPage = Math.ceil(result.length / resultsPerPage);
    const pageNumber = pageOption <= 0 ? 1 : Math.min(pageOption + 1, resultsMaxPage);

    const startResultIndex = Math.min(resultsMaxPage - 1, pageOption) * resultsPerPage;
    Array.from(result.slice(startResultIndex, startResultIndex + resultsPerPage).values()).forEach((result, index) => {
      embed.addFields({
        name: `${index + startResultIndex + 1}.`,
        value: `${result.uploader} - ${result.title}`
      });
    });

    embed.setTitle('Playlist')
      .setTimestamp()
      .setFooter({
        text: `Page ${pageNumber}/${resultsMaxPage}`,
      });

    return interaction.reply({ content: '', components: [], embeds: [embed] });
  });
}