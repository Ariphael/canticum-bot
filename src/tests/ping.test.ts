import { Ping } from '../commands/ping';
import { getClientMock, getInteractionCollectorMock } from '../mocks/mocks';
import { getInteractionMock } from '../mocks/ping.test.mocks';
import { getInteractionResponseMock, getMessageBooleanMock } from '../mocks/mocks';

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ping command', () => {
  const interactionResponse = getInteractionResponseMock();
  const interactionCollector = getInteractionCollectorMock();
  const interaction = 
    getInteractionMock(interactionResponse, interactionCollector);

  const client = getClientMock();

  test('sends a message to the channel', async () => {
    await Ping.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object),
    });
  });
});