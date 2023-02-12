import * as discordJsVoice from '@discordjs/voice';
import { executeConnect } from '../commands/connect';
import { getClientMock } from '../mocks/mocks';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { getChatInputCommandInteractionMock } from '../mocks/mocks';

const discordJsVoiceConnectionMock = ({
  subscribe: jest.fn(),
  on: jest.fn(),
} as unknown) as discordJsVoice.VoiceConnection;

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
    joinVoiceChannel: jest.fn(() => discordJsVoiceConnectionMock),
  };
});

describe('connect command', () => {
  const interaction = getChatInputCommandInteractionMock();

  const client = getClientMock();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls joinVoiceChannel method from @discordjs/voice module to initiate a connection to voice channel (executeConnection called directly)', async () => {
    const joinVoiceChannelSpy = jest.spyOn(discordJsVoice, 'joinVoiceChannel');
    await executeConnect(client, interaction);
    expect(joinVoiceChannelSpy).toHaveBeenCalledTimes(1);
    expect(joinVoiceChannelSpy).toHaveBeenCalledWith({
      channelId: expect.any(Function),
      guildId: expect.any(Function),
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
  });

  test('adds music player to voice connection subscriptions\'s by calling MusicPlayer\'s addToVoiceConnectionSubscriptions function', async () => {
    const musicPlayerAddToVoiceConnectionSubscriptionsMock = 
      jest.spyOn(MusicPlayer.prototype, 'addToVoiceConnectionSubscriptions');
    await executeConnect(client, interaction);
    expect(musicPlayerAddToVoiceConnectionSubscriptionsMock).toHaveBeenCalledTimes(1);
    expect(musicPlayerAddToVoiceConnectionSubscriptionsMock)
      .toHaveBeenCalledWith(discordJsVoiceConnectionMock);
  });

  test('calls interaction.reply upon connecting to a voice channel (executeConnection function directly called)', async () => {
    await executeConnect(client, interaction);
    expect(interaction.reply).toBeCalledTimes(1);
    expect(interaction.reply).toBeCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object)
    });
  });
});