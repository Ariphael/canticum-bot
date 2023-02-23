import { clear } from '../commands/clear';
import { getChatInputCommandInteractionMock, getClientMock } from '../mocks/mocks';
import { addSongRequest, getMusicQueueLength } from '../queue/songQueue';

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('clear command', () => {
  const client = getClientMock();
  const interaction = getChatInputCommandInteractionMock();

  test('clears queue', async () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    addSongRequest('musicTitle3', 'musicId3');
    const queueLength = getMusicQueueLength();
    await clear.run(client, interaction);
    expect(getMusicQueueLength()).not.toBe(queueLength);
    expect(getMusicQueueLength()).toBe(0);
  });

  test('sends message to channel if queue is cleared', async () => {
    await clear.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: expect.any(Object),
    })
  });

  test('sends a message to channel if queue is not cleared', async () => {

  });
});