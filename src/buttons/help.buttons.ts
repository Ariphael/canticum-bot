import { Button, HelpPageInfo } from './button-interface';
import { numPages, embeds } from '../embeds/helpEmbeds';
import { prevButtonId, nextButtonId, helpButtonId } from './buttons';
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

const pageInfo: HelpPageInfo = {
  page: 1, 
  maxPage: numPages,
}

const helpButtonRow = (
  new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(prevButtonId)
        .setLabel('PREV')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pageInfo.page === 1 ? true : false)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId(nextButtonId)
        .setLabel('NEXT')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(pageInfo.page === pageInfo.maxPage ? true : false)
    )
);

export const helpButtons: Button = {
  buttonId: helpButtonId, 
  row: helpButtonRow,
  handleInteraction: async (channel: GuildTextBasedChannel): Promise<void> => {
    await executeHelpButton(helpButtonRow.components, pageInfo, channel);
  }
}

export const updateButtonMessage = async (components: ButtonBuilder[], pageInfo: HelpPageInfo, i: MessageComponentInteraction<CacheType>) => {
  const prevButtonComponent = components[0]; 
  const nextButtonComponent = components[1];

  if (i.customId === prevButtonId) {
    pageInfo.page -= 1;
    nextButtonComponent.setDisabled(false);
    if (pageInfo.page === 1) {
      prevButtonComponent.setDisabled(true);
    }
  } else if (i.customId === nextButtonId) {
    pageInfo.page += 1; 
    prevButtonComponent.setDisabled(false);
    if (pageInfo.page === pageInfo.maxPage) {
      nextButtonComponent.setDisabled(true);
    }
  }
  await i.update({ 
    content: '', 
    components: [helpButtonRow], 
    embeds: [embeds[pageInfo.page - 1]] 
  });
}

export const executeHelpButton = async (components: ButtonBuilder[], pageInfo: HelpPageInfo, channel: GuildTextBasedChannel) => {
  const filter: CollectorFilter<[ButtonInteraction<"cached">]> = (
    ( i: MessageComponentInteraction<CacheType> ) => {
      return i.customId === prevButtonId || i.customId === nextButtonId;
    }
  );
  
  const collector = channel.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async (i: MessageComponentInteraction<CacheType>) => {
    await updateButtonMessage(components, pageInfo, i);
  });
};
