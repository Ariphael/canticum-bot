import { 
  ActionRowBuilder, 
  ButtonBuilder,  
  GuildTextBasedChannel
} from 'discord.js';

export interface Button {
  buttonId: string,
  row: ActionRowBuilder<ButtonBuilder>,
  handleInteraction: (channel: GuildTextBasedChannel) => void
};

export interface HelpPageInfo {
  page: number, 
  maxPage: number,
};