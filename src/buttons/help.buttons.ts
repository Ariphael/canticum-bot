import { Button, HelpPageInfo } from '../interfaces/button-interface';
import { numPages, embeds } from '../embeds/helpEmbeds';
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

const prevButtonId = 'prevButton';
const nextButtonId = 'nextButton';

const helpButtonRow = (
  new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setCustomId(prevButtonId)
        .setLabel('PREV')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(nextButtonId)
        .setLabel('NEXT')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
    ])
);

export const helpButtons: Button = {
  buttonId: [prevButtonId, nextButtonId], 
  row: helpButtonRow,
  handleInteraction: (channel: GuildTextBasedChannel) => {
    executeHelpButton(helpButtonRow.components, pageInfo, channel);
  }
}

export const getPageNumber = (): number => {
  return pageInfo.page;
};

export const resetPageNumber = (): number => {
  return pageInfo.page = 1;
}

export const getNumPages = (): number => {
  return pageInfo.maxPage;
}

const executeHelpButton = (components: ButtonBuilder[], pageInfo: HelpPageInfo, channel: GuildTextBasedChannel) => {
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

const updateButtonMessage = async (components: ButtonBuilder[], pageInfo: HelpPageInfo, i: MessageComponentInteraction<CacheType>) => {
  const prevButtonComponent = components[0]; 
  const nextButtonComponent = components[1];

  if (i.customId === prevButtonId) {
    pageInfo.page -= 1;
    nextButtonComponent.setDisabled(false);
    prevButtonComponent.setDisabled(pageInfo.page === 1);
  } else if (i.customId === nextButtonId) {
    pageInfo.page += 1; 
    prevButtonComponent.setDisabled(false);
    nextButtonComponent.setDisabled(pageInfo.page === pageInfo.maxPage);
  }

  await i.update({ 
    content: '', 
    components: [helpButtonRow], 
    embeds: [embeds[pageInfo.page - 1]] 
  });
}
