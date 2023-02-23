import { ButtonInteraction, CacheType, ChatInputCommandInteraction, Client, ContextMenuCommandInteraction } from "discord.js";

export const getChatInputCommandInteractionMock = () => 
  (({
    reply: jest.fn(),
    commandName: 'example',
    isChatInputCommand: jest.fn(() => {
      return true;
    }),
    isCommand: jest.fn(() => {
      return true;
    }),
  } as unknown) as ChatInputCommandInteraction<CacheType>);

export const getInteractionNotCommandMock = () => 
  (({
    reply: jest.fn(),
    commandName: String,
    isChatInputCommand: jest.fn(() => {
      return false;
    }),
    isCommand: jest.fn(() => {
      return false;
    }),
  } as unknown) as ButtonInteraction<CacheType>);

export const getContextMenuCommandInteractionMock = () => 
  (({
    reply: jest.fn(),
    commandName: String,
    isChatInputCommand: jest.fn(() => {
      return false;
    }),
    isCommand: jest.fn(() => {
      return true;
    }),
  } as unknown) as ContextMenuCommandInteraction<CacheType>);

export const getClientMock = () => 
(({
  intents: [],
  ws: {
    ping: Number,
  },
  on: jest.fn(),
} as unknown) as Client);
