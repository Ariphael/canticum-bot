import { prevButtonId, nextButtonId } from '../buttons/buttonIdData.json';
import { Button } from '../buttons/button-interface';
import { 
  ButtonInteraction, 
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  GuildTextBasedChannel, 
  InteractionCollector, 
  InteractionResponse, 
  Message, 
  MessageComponentInteraction, 
  SelectMenuInteraction 
} from "discord.js";
import { Command } from '../commands/command-interface';
import { VoiceConnection } from '@discordjs/voice';

type interactionCollectorType = 
  InteractionCollector<SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>>;

export const getClientMock = () => 
  (({
    intents: [],
    ws: {
      ping: Number,
    }
  } as unknown) as Client);

export const getInteractionCollectorMock = () => 
  (({
    on: jest.fn(),
  } as unknown) as interactionCollectorType);

export const getInteractionResponseMock = () => 
  (({
    interaction: {
      createdTimestamp: Number,
    }
  } as unknown) as InteractionResponse<boolean>);

export const getMessageBooleanMock = () => (({} as unknown) as Message<boolean>);

export const getHelpButtonsMock = () => 
  (({
    row: {
      components: [{
        setDisabled: jest.fn(),
      }, {
        setDisabled: jest.fn(),
      }]
    }
  } as unknown) as Button)

export const getHelpPrevButtonMock = () => 
  (({
    customId: prevButtonId,
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>);

export const getHelpNextButtonMock = () =>
  (({
    customId: nextButtonId,
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>);

export const getGuildTextBasedChannelMock = (interactionCollector: interactionCollectorType) => 
  (({
    createMessageComponentCollector: jest.fn(() => {
      return interactionCollector;
    }), 
  } as unknown) as GuildTextBasedChannel);

export const getInteractionNotChatInputCommandMock = () => 
  (({
    reply: jest.fn(),
    commandName: String,
    isChatInputCommand: jest.fn(() => {
      return false;
    })
  } as unknown) as ButtonInteraction<CacheType>);

export const getSlashCommandMock = () => 
  (({
    name: String, 
    description: String, 
    run: jest.fn(),
  } as unknown) as Command);

export const getMessageComponentInteractionMock = () =>
  (({
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>);

export const getChatInputCommandInteractionMock = () => 
  (({
    guild: {
      id: String,
      voiceAdapterCreator: jest.fn()
    },
    editReply: jest.fn(), 
    options: {
      getChannel: jest.fn((name: string) => {
        return {
          id: String,
        }
      }),
    },
    reply: jest.fn(),
  } as unknown) as ChatInputCommandInteraction<CacheType>);