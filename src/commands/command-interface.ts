import { 
  ChatInputCommandInteraction, 
  ChatInputApplicationCommandData, 
  CacheType 
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  run: (interaction: ChatInputCommandInteraction<CacheType>) => void;
}