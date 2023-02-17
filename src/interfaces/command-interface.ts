import { 
  ChatInputCommandInteraction, 
  ChatInputApplicationCommandData, 
  CacheType,
  Client
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  name: string,
  description: string,
  run: (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>,
};