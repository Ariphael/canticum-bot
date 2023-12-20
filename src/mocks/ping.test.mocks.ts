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
    interactionCollector: interactionCollectorType
  ) => (
    ({
      reply: jest.fn(() => { return interactionResponse; }),
      channel: {
        createMessageComponentCollector: jest.fn(() => { return interactionCollector; }),
      },
      createdTimestamp: Number,
    } as unknown) as ChatInputCommandInteraction<CacheType>
  );