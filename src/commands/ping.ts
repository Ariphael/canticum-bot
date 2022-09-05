import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from './command-interface';

export const Ping: Command = {
  name: 'ping',
  description: 'Replies with "Pong!" (used for checking if bot is alive)',
  run: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    await executePing(interaction);
  }
};

export const executePing = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  // TODO
};