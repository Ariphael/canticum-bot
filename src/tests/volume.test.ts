import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { volume } from '../commands/volume';
import { getClientMock, getInteractionResponseMock } from '../mocks/mocks';

const client = getClientMock();
const interaction = ({
  options: {
    getNumber: jest.fn(),
  },
  reply: jest.fn(),
} as unknown) as ChatInputCommandInteraction<CacheType>;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('volume command', () => {
  test('sends an error message (ephemeral=true) to channel if volume option is less than 0', () => {
    jest.spyOn(interaction.options, 'getNumber').mockImplementationOnce(() => -0.3);
    volume.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
      ephemeral: true,
    })
  });
  test('sends an error message (ephemeral=true) to channel if volume option is greater than 1', async () => {
    jest.spyOn(interaction.options, 'getNumber').mockImplementationOnce(() => 1.1);
    await volume.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
      ephemeral: true,
    });
  });

  test('sends a message (ephemeral=false) to channel confirming volume change (volume option is equal to 0)', async () => {
    jest.spyOn(interaction.options, 'getNumber').mockImplementationOnce(() => 0);
    await volume.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
      ephemeral: false,
    });
  });

  test('sends a message to channel (ephemeral=false) confirming volume change (volume option is equal to 1)', async () => {
    jest.spyOn(interaction.options, 'getNumber').mockImplementationOnce(() => 1);
    await volume.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
      ephemeral: false,
    });
  });

  test('sends a message to channel (ephemeral=false) confirming volume change (volume option is between 0 and 1)', async () => {
    jest.spyOn(interaction.options, 'getNumber').mockImplementationOnce(() => 0.5);
    await volume.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
      ephemeral: false,
    });
  });

  test('sends an error message to channel (ephemeral=true) if failed to change volume', async () => {
    const newVolume = 0.5;
    jest.spyOn(interaction.options, 'getNumber').mockImplementationOnce(() => newVolume);
    const musicPlayerSetVolumeSpy = jest.spyOn(MusicPlayer.prototype, 'setVolume');
    await volume.run(client, interaction);
    expect(musicPlayerSetVolumeSpy).toHaveBeenCalledTimes(1);
    expect(musicPlayerSetVolumeSpy).toHaveBeenCalledWith(newVolume);
  });
})