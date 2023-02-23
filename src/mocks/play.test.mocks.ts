import { ChatInputCommandInteraction, CacheType } from "discord.js";

export const getChatInputCommandInteractionMock = () => 
(({
  guild: {
    id: String,
    voiceAdapterCreator: jest.fn()
  },
  editReply: jest.fn(), 
  options: {
    getString: jest.fn(),
  },
  reply: jest.fn(),
} as unknown) as ChatInputCommandInteraction<CacheType>);