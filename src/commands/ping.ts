import { Command } from '../interfaces/command-interface';
import { 
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder,
} from 'discord.js';

export const Ping: Command = {
  name: 'ping',
  description: 'Replies with "Pong!" (used for checking if bot is alive)',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executePing(client, interaction);
  }
};

const executePing = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Pong!');

  await interaction.reply({ content: '', components: [], embeds: [embed] });
};