import { queue } from '../commands/queue';
import { getChatInputCommandInteractionMock, getClientMock } from '../mocks/mocks';

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('queue command', () => {
  const client = getClientMock();
  const interaction = getChatInputCommandInteractionMock();

  test('sends a message to channel', async () => {
    await queue.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: expect.any(Object),
    })
  });
});