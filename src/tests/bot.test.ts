import { startCanticum } from '../bot';
import { getClientMock } from '../mocks/bot.test.mocks';
import { BitFieldResolvable, Client, ClientUser } from 'discord.js';

describe('bot.ts tests', () => {
  const client = getClientMock();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls console.log to indicate bot is starting', () => {
    const logSpy = jest.spyOn(console, 'log');
    startCanticum(client);
    expect(logSpy).toHaveBeenCalledWith(expect.any(String));
  });

  test('calls function that sets up ready listener correctly', () => {
    startCanticum(client);
    expect(client.once).toHaveBeenCalledTimes(1);
    expect(client.once).toHaveBeenCalledWith('ready', expect.any(Function));
  });

  test('calls function that sets up interactionCreate listener correctly', () => {
    startCanticum(client);
    expect(client.on).toHaveBeenCalledTimes(1);
    expect(client.on).toHaveBeenCalledWith('interactionCreate', expect.any(Function));
  });

  test('calls client.login correctly', () => {
    startCanticum(client);
    expect(client.login).toHaveBeenCalledTimes(1);
    expect(client.login).toHaveBeenCalledWith(expect.any(String));
  });
})