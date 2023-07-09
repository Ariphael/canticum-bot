import { skip } from '../commands/skip';
import { getChatInputCommandInteractionMock, getClientMock } from '../mocks/mocks';
import { MusicPlayer } from '../musicplayer/MusicPlayer';

jest.mock('../musicplayer/MusicPlayer', () => {
  return {
    __esmodule: true,
    ...jest.requireActual('../musicplayer/MusicPlayer')
  }
});

const client = getClientMock();
const interaction = getChatInputCommandInteractionMock();

describe('skip command', () => {
  test('stops audio player', async () => {
    const stopAudioPlayerSpy = jest.spyOn(MusicPlayer.prototype, 'stopAudioPlayer');
    await skip.run(client, interaction);
    expect(stopAudioPlayerSpy).toHaveBeenCalledTimes(1);
  });

  test('plays new resource on audio player', async () => {
    const playAudioSpy = jest.spyOn(MusicPlayer.prototype, 'playAudio');
    await skip.run(client, interaction);
    expect(playAudioSpy).toHaveBeenCalledTimes(1);
  });

  test('sends a message to channel when done', async () => {
    await skip.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    })
  });
});
