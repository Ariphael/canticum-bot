import { Command } from '../interfaces/command-interface';
import { embeds, getCommandEmbed } from '../embeds/helpEmbeds';
import { buttons } from '../buttons/buttons';
import { helpButtonId } from '../buttons/buttonIdData.json';
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

const executeHelp = async (_client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  if (interaction.options.get('command')) {
    const commandEmbed: EmbedBuilder = getCommandEmbed(interaction.options.getString('command'));
    await interaction.editReply({ content: '', components: [], embeds: [commandEmbed]});
    return;
  } 
  
  const helpButton = buttons.find(b => b.buttonId === helpButtonId);

  helpButton.handleInteraction(interaction.channel);

  await interaction.reply({ content: '', components: [helpButton.row], embeds: [embeds[0]] });
};