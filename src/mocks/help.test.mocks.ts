import { ChatInputCommandInteraction, CacheType, CommandInteractionOption, ApplicationCommandOptionType } from "discord.js";

export const getChatInputCommandInteractionMock = () => 
  (({
    guild: {
      id: String,
    },
    options: {
      get: jest.fn(),
      getString: jest.fn(),
    },
    channel: {
      createMessageComponentCollector: jest.fn(() => {
        return {
          on: jest.fn(),
        }
      }),
    },
    reply: jest.fn(),
  } as unknown) as ChatInputCommandInteraction<CacheType>);

export const getCommandInteractionOptionMock = () => 
  ({
    name: String,
    type: ApplicationCommandOptionType.String,
  } as unknown) as CommandInteractionOption<CacheType>;