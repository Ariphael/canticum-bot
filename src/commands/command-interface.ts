import { 
  ChatInputCommandInteraction, 
  ChatInputApplicationCommandData, 
  CacheType,
  Client
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => void;
};