import { CacheType, ChatInputCommandInteraction } from "discord.js";

export const getChatInputCommandInteractionMock = () => 
  (({
    reply: jest.fn(),
    commandName: String,
    isChatInputCommand: jest.fn(() => {
      return true;
    })
  } as unknown) as ChatInputCommandInteraction<CacheType>)