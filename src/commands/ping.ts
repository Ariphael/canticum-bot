import { Command } from './command-interface';
import { buttons } from '../buttons/buttons';
import { buttonId } from '../buttons/pingOk';
import { 
  CacheType, 
  ChatInputCommandInteraction, 
  Client,
  EmbedBuilder
} from 'discord.js';

export const Ping: Command = {
  name: 'ping',
  description: 'Replies with "Pong!" (used for checking if bot is alive)',
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
    await executePing(client, interaction);
  }
};

export const executePing = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const button = buttons.find(b => b.buttonId === buttonId);
  const row = button.row;
  
  button.handleInteraction(interaction.channel);

  const embed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Pong!');

  interaction.deferReply().then(async (resultMessage) => {
    const botLatency = resultMessage.interaction.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = client.ws.ping;
    embed.setDescription(
      `Bot latency: ${botLatency}ms\nAPI latency: ${apiLatency}ms`
    );
    await interaction.editReply({ content: '', components: [row], embeds: [embed] })
  });
};