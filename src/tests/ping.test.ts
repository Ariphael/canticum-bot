import { Ping, executePing } from '../commands/ping';
import { getClientMock, getInteractionCollectorMock } from '../mocks/mocks';
import { getInteractionMock } from '../mocks/ping.test.mocks';
import { getInteractionResponseMock, getMessageBooleanMock } from '../mocks/mocks';

describe('ping command', () => {
  const messageBoolean = getMessageBooleanMock();
  const interactionResponse = getInteractionResponseMock();
  const interactionCollector = getInteractionCollectorMock();
  const interaction = 
    getInteractionMock(interactionResponse, messageBoolean, interactionCollector);

  const client = getClientMock();

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