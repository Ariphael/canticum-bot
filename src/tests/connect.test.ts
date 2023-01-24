import { joinVoiceChannel } from '@discordjs/voice';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { Connect, executeConnect } from '../commands/connect';
import { executeDisconnect } from '../commands/disconnect';
import { startCanticum } from '../bot';
import { getClientMock } from '../mocks/mocks';

describe('connect command', () => {
  const interaction = ({
    guild: {
      id: String,
      voiceAdapterCreator: Number,
    },
    editReply: jest.fn(), 
    options: {
      getChannel: jest.fn((name: string) => {
        return {
          id: String,
        }
      }),
    },
    reply: jest.fn(),
  } as unknown) as ChatInputCommandInteraction<CacheType>;

  const client = getClientMock();

  jest.mock('@discordjs/voice');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // could not find way to test run method in Connect because of joinVoiceChannel in 
  // @discordjs/voice being declared as function declaration rather than function expression.

  test('calls joinVoiceChannel method from @discordjs/voice module to initiate a connection to voice channel (executeConnection called directly)', async () => {
    const spy = jest.spyOn(console, 'log');
    await executeConnect(client, interaction, true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(String));
  });

  test('calls interaction.reply upon connecting to a voice channel (executeConnection function directly called)', async () => {
    await executeConnect(client, interaction, true);
    expect(interaction.reply).toBeCalledTimes(1);
    expect(interaction.reply).toBeCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object)
    });
  });

  test('calls joinVoiceChannel and interaction.reply if connection to a voice channel is already established (executeConnection function directly called)', async () => {
    const spy = jest.spyOn(console, 'log');
    await executeConnect(client, interaction, true);
    await executeConnect(client, interaction, true);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(expect.any(String));
    expect(interaction.reply).toHaveBeenCalledTimes(2);
    expect(interaction.reply).toBeCalledWith({ 
      content: '', 
      components: expect.any(Object), 
      embeds: expect.any(Object)
    });
  })
});