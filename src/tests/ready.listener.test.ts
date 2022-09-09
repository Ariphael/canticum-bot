import { ready, doHandleReady } from '../listeners/ready';
import { Client } from "discord.js";

const client = ({
  user: {
    tag: String,
  }, 
  application: {
    commands: {
      set: jest.fn(),
    }
  }
} as unknown) as Client;

const clientUserNull = ({
  user: null, 
  application: {
    commands: {
      set: jest.fn(),
    }
  }
} as unknown) as Client;

const clientApplicationNull = ({
  user: {
    tag: String,
  }, 
  application: null,
} as unknown) as Client;

const clientUserApplicationNull = ({
  user: null, 
  application: null,
} as unknown) as Client;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ready listener fail cases', () => {
  test('returns if client.user is null (doHandleReady directly called)', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await doHandleReady(clientUserNull);
    expect(logSpy).not.toHaveBeenCalled();
    expect(clientUserNull.application.commands.set).not.toHaveBeenCalled();
  });

  test('returns if client.application is null (doHandleReady directly called)', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await doHandleReady(clientApplicationNull);
    expect(logSpy).not.toHaveBeenCalled();
  });

  test('returns if client.user and client.application is null (doHandleReady directly called)', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await doHandleReady(clientUserApplicationNull);
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe('ready listener success cases', () => {
  test('calls client.application.commands.set correctly (doHandleReady directly called)', async () => {
    await doHandleReady(client);
    expect(client.application.commands.set).toHaveBeenCalledTimes(1); 
    expect(client.application.commands.set).toHaveBeenCalledWith([{
      name: expect.any(String), 
      description: expect.any(String), 
      run: expect.any(Function),
    }]);
  });

  test('console logs client.user.tag after client.application.commands.set (doHandleReady directly called)', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await doHandleReady(client);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`${client.user.tag}`));
  });
});