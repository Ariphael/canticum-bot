import { Command } from './command-interface';
import { buttons } from '../buttons/buttons';
import { pingOkButtonId } from '../buttons/buttonIdData.json';
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

export const executePing = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
  const button = buttons.find(b => b.buttonId === pingOkButtonId);
  const row = button.row;
  
  button.handleInteraction(interaction.channel);

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Pong!');

  const msg = await interaction.deferReply();
  const botLatency = msg.interaction.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = client.ws.ping;
  embed.setDescription(
    `Bot latency: ${botLatency}ms\nAPI latency: ${apiLatency}ms`
  );

  await interaction.editReply({ content: '', components: [row], embeds: [embed] });
};