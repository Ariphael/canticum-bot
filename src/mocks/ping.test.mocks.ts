import { 
  ButtonInteraction, 
  CacheType, 
  ChatInputCommandInteraction, 
  InteractionCollector, 
  InteractionResponse, 
  Message, 
  SelectMenuInteraction 
} from "discord.js";

type interactionCollectorType = 
  InteractionCollector<SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>>;

export const getInteractionMock = 
  (
    interactionResponse: InteractionResponse<boolean>, 
    messageBoolean: Message<boolean>, 
    interactionCollector: interactionCollectorType
  ) => (
    ({
      deferReply: jest.fn(() => { return interactionResponse; }),
      editReply: jest.fn(() => { return messageBoolean; }),
      channel: {
        createMessageComponentCollector: jest.fn(() => { return interactionCollector; }),
      },
      createdTimestamp: Number,
    } as unknown) as ChatInputCommandInteraction<CacheType>
  );