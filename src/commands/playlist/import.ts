import { CacheType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import * as db from '../../utils/database';

const importPlaylistInfo = (interaction: ChatInputCommandInteraction<CacheType>, embed: EmbedBuilder) => {
  const memberId = interaction.member.user.id;
  const url = interaction.options.get('url').value as string;

  
}