import { ChatInputCommandInteraction, CacheType, EmbedBuilder, userMention } from "discord.js";
import * as db from '../../utils/database';

export const executePlaylistDelete = async (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const playlistName = interaction.options.get('name').value as string;

  await db.query('SELECT * FROM playlist WHERE playlistName = ? AND userId = ?', [playlistName, memberId])
    .then((result) => {
      if (result.length === 0) {
        embed.setDescription(`No playlist with name ${playlistName} belonging to ${userMention(memberId)} was found`)
          .setTimestamp();
        interaction.reply({ content: '', components: [], embeds: [embed] })
      } else {
        db.query('DELETE FROM playlist WHERE playlistName = ? AND userId = ?', [playlistName, memberId])
          .then(_ => {
            embed.setDescription(`Successfully deleted playlist "${playlistName}" belonging to ${userMention(memberId)}`)
              .setTimestamp();
            interaction.reply({ content: '', components: [], embeds: [embed] });
          });
      }
    })
}