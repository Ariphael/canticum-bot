import { Command } from '../interfaces/command-interface';
import helpEmbeds from '../commands/static/help_embeds.json';
import commandInfoData from '../commands/static/bot_commands.json';
import { 
  ApplicationCommandOptionType, 
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  CommandInteractionOptionResolver, 
  EmbedBuilder,
  EmbedData
} from 'discord.js';

export const help: Command = {
  name: 'help', 
  description: 'displays list of commands',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'command',
    description: 'displays detailed info about specific commands', 
    required: false,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeHelp(client, interaction);
  }
}; 

const executeHelp = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  const commandInteractionOption = interaction.options.get('command');
  if (commandInteractionOption) {
    const commandOption = commandInteractionOption.value as string;
    const commandEmbed: EmbedBuilder = commandInfoData.hasOwnProperty(commandOption)
      ? new EmbedBuilder(commandInfoData[commandOption])
      : new EmbedBuilder(helpEmbeds.unknownCommand);
    commandEmbed.setTimestamp();
    return await interaction.reply({ content: '', components: [], embeds: [commandEmbed]});
  }

  return await interaction.reply({ content: '', components: [], embeds: [new EmbedBuilder(helpEmbeds.mainHelpEmbed)] });
};