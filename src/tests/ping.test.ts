import { Ping, executePing } from '../commands/ping';
import { Button } from '../buttons/button-interface';
import { ActionRowBuilder, 
  ButtonInteraction, 
  ButtonBuilder,
  CacheType, 
  ChatInputCommandInteraction, 
  Client, 
  EmbedBuilder, 
  GuildTextBasedChannel, 
  InteractionCollector, 
  InteractionResponse, 
  Message, 
  SelectMenuInteraction, 
  WebhookEditMessageOptions 
} from 'discord.js';

describe('ping command', () => {
  const messageBoolean = ({} as unknown) as Message<boolean>;

  const interactionResponse = ({
    interaction: {
      createdTimestamp: Number,
    }
  } as unknown) as InteractionResponse<boolean>;

  const interactionCollector = ({
    on: jest.fn(),
  } as unknown) as InteractionCollector<SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>>;

  const interaction = ({
    deferReply: jest.fn(() => { return interactionResponse; }),
    editReply: jest.fn(() => { return messageBoolean; }),
    channel: {
      createMessageComponentCollector: jest.fn(() => { return interactionCollector; }),
    },
    createdTimestamp: Number,
  } as unknown) as ChatInputCommandInteraction<CacheType>;

  const client = ({
    intents: [],
    ws: {
      ping: Number,
    }
  } as unknown) as Client;

  // const button = ({
  //   handleInteraction: jest.fn(),
  // } as unknown) as Button;

  // const buttonArr = ({
  //   find: jest.fn(() => { return button; }),
  // } as unknown) as Button[];

  // const guildTextBasedChannel = ({} as unknown) as GuildTextBasedChannel;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // The 3 tests below may be pointless...

  // test('executePing calls buttons.find once (executePing directly called)', async () => {
  //   await executePing(client, interaction);
  //   expect(buttonArr.find).toHaveBeenCalledTimes(1);
  //   expect(buttonArr.find).toHaveBeenCalledWith(button);
  // });

  // test('executePing calls buttons.handleInteraction once (executePing directly called)', async () => {
  //   await executePing(client, interaction);
  //   expect(button.handleInteraction).toHaveBeenCalledTimes(1);
  //   expect(button.handleInteraction).toHaveBeenCalledWith(guildTextBasedChannel);
  // });

  // test('executePing creates embed (called using slash command run function)', () => {
  //   Ping.run(client, interaction);
  //   expect(interaction.deferReply).toHaveBeenCalledTimes(1);
  //   expect(interaction.editReply).toHaveBeenCalledTimes(1);
  //   expect(interaction.editReply).toHaveBeenCalledWith(webhookEditMessageOptions);
  // });

  test('executePing correctly calls deferReply and editReply (executePing directly called)', async () => {
    await executePing(client, interaction);
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.editReply).toHaveBeenCalledTimes(1);
    expect(interaction.editReply).toHaveBeenCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object),
    });
  });

  test('executePing correctly calls deferReply and editReply (called using slash command run function)', async () => {
    // test breaks w/o await below
    await Ping.run(client, interaction);
    expect(interaction.deferReply).toHaveBeenCalledTimes(1);
    expect(interaction.editReply).toHaveBeenCalledTimes(1);
    expect(interaction.editReply).toHaveBeenCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object),
    });
  });
});