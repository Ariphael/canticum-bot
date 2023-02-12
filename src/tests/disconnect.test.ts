import * as discordJsVoice from '@discordjs/voice';
import { executeConnect } from "../commands/connect";
import { executeDisconnect } from "../commands/disconnect";
import { getChatInputCommandInteractionMock, getClientMock } from "../mocks/mocks";

const discordJsVoiceConnectionMock = ({
  subscribe: jest.fn(),
  joinConfig: {
    channelId: String,
  },
  destroy: jest.fn(),
  on: jest.fn(),
} as unknown) as discordJsVoice.VoiceConnection;

var voiceConnection: discordJsVoice.VoiceConnection = null;

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
    joinVoiceChannel: jest.fn(() => {
      return voiceConnection = discordJsVoiceConnectionMock;
    }),
    getVoiceConnection: jest.fn(() => voiceConnection),
  };
});

describe('disconnect command', () => {
  const client = getClientMock();
  const interaction = getChatInputCommandInteractionMock();

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('calls interaction.reply with ephemeral flag enabled if there does not exist a voice channel connection (executeDisconnect called directly)', async () => {
    expect.assertions(4);
    await executeDisconnect(client, interaction); 
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: false,      
    });
    expect(interaction.reply).not.toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object),       
    });
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: true,
    });
  });

  test('calls interaction.reply with ephemeral flag set to default value (false) if there exists a voice channel connection (executeDisconnect called directly)', async () => {
    expect.assertions(4);
    await executeConnect(client, interaction);
    await executeDisconnect(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(2);
    expect(interaction.reply).not.toHaveBeenNthCalledWith(1, {
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: true,
    });  
    expect(interaction.reply).not.toHaveBeenNthCalledWith(1, {
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: false,
    });  
    expect(interaction.reply).toHaveBeenNthCalledWith(1, {
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
    });    
  })
});