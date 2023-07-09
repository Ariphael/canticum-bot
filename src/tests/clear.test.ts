import { clear } from '../commands/clear';
import { getChatInputCommandInteractionMock, getClientMock } from '../mocks/mocks';
import { musicQueue } from '../queue/musicQueue';
// import { addSongRequest, getMusicQueueLength } from '../queue/musicQueue';
 
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('clear command', () => {
  const client = getClientMock();
  const interaction = getChatInputCommandInteractionMock();

  test('changes nothing if queue is empty', async () => {
    await clear.run(client, interaction);
    expect(musicQueue.getLength()).toBe(0);    
  });

  test('clears queue', async () => {
    for (let i = 0; i < 3; i++) {
      musicQueue.enqueue({
        musicTitle: `musicTitle${i}`,
        musicId: `musicId${i}`,
        uploader: 'uploader1',
        originalURL: 'originalURL'
      });
    }

    const queueLength = musicQueue.getLength();
    await clear.run(client, interaction);
    expect(musicQueue.getLength()).not.toBe(queueLength);
    expect(musicQueue.getLength()).toBe(0);
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
});