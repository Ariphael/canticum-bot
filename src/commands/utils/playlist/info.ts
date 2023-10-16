import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import * as db from '../../../utils/database';

const resultsPerPage = 15;

export const executePlaylistInfo = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;
  const pageOption = interaction.options.get('page') ? interaction.options.get('page').value as number : 0;

  embed.setTitle('Playlist');

  await db.query(
    `SELECT title, uploader FROM playlist_items INNER JOIN playlist_content_map USING (playlistItemId) INNER JOIN playlist USING (playlistId) WHERE userId = ? AND title = ? ORDER BY title`,
    [memberId, playlistName]
  ).then((result) => {
    if (result.length === 0) {
      embed.setDescription(`No playlist with name ${playlistName} was found`);
      return interaction.reply({ content: '', components: [], embeds: [embed] });
    }

    const resultsMaxPage = Math.ceil(result.length / resultsPerPage);
    const pageNumber = Math.min(pageOption - 1, resultsMaxPage);

    const startResultIndex = pageNumber * resultsPerPage;
    Array.from(result.slice(startResultIndex, startResultIndex + resultsPerPage).values()).forEach((result, index) => {
      embed.addFields({
        name: `${index + startResultIndex + 1}.`,
        value: `${result.uploader} - ${result.title}`
      });
    });

    embed
      .setTimestamp()
      .setFooter({
        text: `Page ${pageNumber}/${resultsMaxPage}`,
      });

    return interaction.reply({ content: '', components: [], embeds: [embed] });
  });
}