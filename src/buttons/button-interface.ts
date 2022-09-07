import { 
  CacheType, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonInteraction, 
  GuildTextBasedChannel
} from 'discord.js';

export interface Button {
  buttonId: string,
  row: ActionRowBuilder<ButtonBuilder>,
  handleInteraction: (channel: GuildTextBasedChannel) => void
};