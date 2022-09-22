import { Command } from './command-interface';
import { embeds, getCommandEmbed } from '../embeds/helpEmbeds';
import { prevButtonId, nextButtonId } from '../buttons/help.buttons';
import { buttons } from '../buttons/buttons';
import { 
  ApplicationCommandOptionType, 
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  EmbedBuilder
} from 'discord.js';

export const Help: Command = {
  name: 'help', 
  description: 'displays list of commands',
  options: [{
    type: ApplicationCommandOptionType.String,
    name: 'command',
    description: 'displays abstract of specific commands', 
    required: false,
  }],
  run: async (client: Client, interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
    await executeHelp(client, interaction);
  }
}; 

export const executeHelp = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();
  
  if (interaction.options.get('command')) {
    const commandEmbed: EmbedBuilder = getCommandEmbed(interaction.options.getString('command'));
    await interaction.editReply({ content: '', components: [], embeds: [commandEmbed]});
    return;
  } 
  const prevButton = buttons.find(b => b.buttonId === prevButtonId);
  const nextButton = buttons.find(b => b.buttonId === nextButtonId);
  const prevRow = prevButton.row;
  const nextRow = nextButton.row;
  
  prevButton.handleInteraction(interaction.channel);
  nextButton.handleInteraction(interaction.channel);

  await interaction.editReply({ content: '', components: [prevRow, nextRow], embeds: [embeds[0]] });
};