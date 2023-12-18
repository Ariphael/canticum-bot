import { Command } from '../interfaces/command-interface';
import { mainHelpEmbed, getCommandEmbed } from '../embeds/helpEmbeds';
// import { helpButtons } from '../buttons/help.buttons';
import { 
  ApplicationCommandOptionType, 
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  CommandInteractionOptionResolver, 
  EmbedBuilder
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
    const commandOption: String = commandInteractionOption.value as String;
    const commandEmbed: EmbedBuilder = getCommandEmbed(commandOption);
    await interaction.reply({ content: '', components: [], embeds: [commandEmbed]});
    return;
  }

  // await interaction.reply({ content: '', components: [helpButtons.row], embeds: [embeds[0]] });
  await interaction.reply({ content: '', components: [], embeds: [mainHelpEmbed] });
};