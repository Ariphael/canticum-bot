import { Button } from './button-interface';
import { 
  ActionRowBuilder, 
  CacheType, 
  ButtonBuilder, 
  ButtonInteraction, 
  ButtonStyle,
  CollectorFilter, 
  GuildTextBasedChannel,
  MessageComponentInteraction
} from 'discord.js';

export const buttonId = 'pingOk';

export const pingOk: Button = {
  buttonId: buttonId,
  row: new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('pingOk')
      .setLabel('Ok')
      .setStyle(ButtonStyle.Primary),
  ), 
  handleInteraction: async (channel: GuildTextBasedChannel) => {
    await executePingOk(channel);
  }
};

const executePingOk = async (channel: GuildTextBasedChannel) => {
  // await interaction.editReply({ content: 'You clicked Ok!', components: [] });
  const filter: CollectorFilter<[ButtonInteraction<"cached">]> = 
    ( i: MessageComponentInteraction<CacheType> ) => i.customId === buttonId;

  const collector = channel.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', async (i: MessageComponentInteraction<CacheType>) => {
    await i.update({ content: 'You clicked Ok!', components: [] });
  });
  
  collector.on('end', collected => console.log(`Collected ${collected.size} items`));
};