import { Button } from './button-interface';
import { pingOkButtonId } from './buttonIdData.json';
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

const okButtonRow = (
  new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setCustomId(pingOkButtonId)
        .setLabel('OK')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false),
    ])
);

export const pingOk: Button = {
  buttonId: pingOkButtonId,
  row: okButtonRow, 
  handleInteraction: async (channel: GuildTextBasedChannel): Promise<void> => {
    await executePingOk(channel);
  }
};

export const executePingOk = async (channel: GuildTextBasedChannel): Promise<void> => {
  const filter: CollectorFilter<[ButtonInteraction<"cached">]> = 
    ( i: MessageComponentInteraction<CacheType> ) => i.customId === pingOkButtonId;

  const collector = channel.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', async (i: MessageComponentInteraction<CacheType>) => {
    await i.update({ content: 'You clicked Ok!', components: [] });
  });
  
  collector.on('end', collected => console.log(`Collected ${collected.size} items`));
};