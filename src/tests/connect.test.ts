import * as discordJsVoice from '@discordjs/voice';
import { connect } from '../commands/connect';
import { getClientMock } from '../mocks/mocks';
import { getChatInputCommandInteractionMock } from '../mocks/mocks';

const discordJsVoiceConnectionMock = ({
  subscribe: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
} as unknown) as discordJsVoice.VoiceConnection;

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
    joinVoiceChannel: jest.fn(() => discordJsVoiceConnectionMock),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('connect command', () => {
  const interaction = getChatInputCommandInteractionMock();

  const client = getClientMock();

  test('initiates a connection to a voice channel', async () => {
    const joinVoiceChannelSpy = jest.spyOn(discordJsVoice, 'joinVoiceChannel');
    await connect.run(client, interaction);
    expect(joinVoiceChannelSpy).toHaveBeenCalledTimes(1);
    expect(joinVoiceChannelSpy).toHaveBeenCalledWith({
      channelId: expect.any(Function),
      guildId: expect.any(Function),
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
  });

  test('sends message to channel', async () => {
    await connect.run(client, interaction);
    expect(interaction.reply).toBeCalledTimes(1);
    expect(interaction.reply).toBeCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object)
    });
  });
});