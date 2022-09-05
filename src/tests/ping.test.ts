import { Ping, executePing } from '../commands/ping';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

describe('ping command', () => {
  const interaction = ({
    reply: jest.fn(),
  } as unknown) as ChatInputCommandInteraction<CacheType>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('executePing replies with a string (called using slash command run function)', () => {
    Ping.run(interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith(expect.any(String));
  });

  test('executePing replies with a string (executePing directly called)', () => {
    executePing(interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith(expect.any(String));
  });
});