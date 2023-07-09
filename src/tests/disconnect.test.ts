import * as discordJsVoice from '@discordjs/voice';
import { disconnect } from "../commands/disconnect";
import { getChatInputCommandInteractionMock, getClientMock } from "../mocks/mocks";

const discordJsVoiceConnectionMock = ({
  subscribe: jest.fn(),
  joinConfig: {
    channelId: String,
  },
  destroy: jest.fn(),
  on: jest.fn(),
} as unknown) as discordJsVoice.VoiceConnection;

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
    joinVoiceChannel: jest.fn(),
    getVoiceConnection: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('disconnect command', () => {
  const client = getClientMock();
  const interaction = getChatInputCommandInteractionMock();

  test('destroys voice connection if connection exists', async () => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection').mockImplementationOnce(() => {
      return discordJsVoiceConnectionMock;
    });
    const voiceConnectionDestroySpy = jest.spyOn(discordJsVoiceConnectionMock, 'destroy');
    await disconnect.run(client, interaction);
    expect(voiceConnectionDestroySpy).toHaveBeenCalledTimes(1);
    expect(voiceConnectionDestroySpy).toHaveBeenCalledWith();
  });

  test('does not attempt to destroy a non-existant voice connection', async () => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection').mockImplementationOnce(() => {
      return null;
    });   
    const voiceConnectionDestroySpy = jest.spyOn(discordJsVoiceConnectionMock, 'destroy');
    await disconnect.run(client, interaction);
    expect(voiceConnectionDestroySpy).not.toHaveBeenCalled();  
  });

  test('sends a message to channel (connection exists)', async () => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection').mockImplementationOnce(() => {
      return discordJsVoiceConnectionMock;
    });
    await disconnect.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);    
    expect(interaction.reply).toHaveBeenCalledWith({
      content: '', 
      components: [], 
      embeds: expect.any(Object),
    });
  });

  test('sends a message to channel with ephemeral flag set to true (connection does not exist)', async () => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection').mockImplementationOnce(() => {
      return null;
    });
    await disconnect.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);    
    expect(interaction.reply).toHaveBeenCalledWith({
      content: '', 
      components: [], 
      embeds: expect.any(Object),
      ephemeral: true,
    });    
  });
});