import { Collection } from 'discord.js';
import { addReadyEventToClient } from '../events/ready';
import { Command } from '../interfaces/command-interface';
import { 
  getClientApplicationNullMock, 
  getClientMock, 
  getClientUserApplicationNullMock, 
  getClientUserNullMock 
} from '../mocks/ready.listener.mocks';

const client = getClientMock();

const clientUserNull = getClientUserNullMock();

const clientApplicationNull = getClientApplicationNullMock();

const clientUserApplicationNull = getClientUserApplicationNullMock();

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ready listener', () => {
  test('does not set commands if there exists no logged in client user', async () => {
    const clientOnSpy = jest.spyOn(clientUserNull, 'once');
    const commandCollection = new Collection<string, Command>();
    addReadyEventToClient(clientUserNull, commandCollection);
    const callback = clientOnSpy.mock.calls[0][1];
    await callback();
    expect(clientUserNull.application.commands.set).not.toHaveBeenCalled();
  });

  test('does not set commands if application of bot is null', async () => {
    const clientOnSpy = jest.spyOn(clientApplicationNull, 'once');
    const commandCollection = new Collection<string, Command>();
    addReadyEventToClient(clientApplicationNull, commandCollection);
    const callback = clientOnSpy.mock.calls[0][1];
    // client.application is null so line12 of src/events/ready.ts should never be reached
    const callbackReturnVal = await callback();
    expect(callbackReturnVal).toBeUndefined();
  });

  test('does not set commands if client.application and client.user is null', async () => {
    const clientOnSpy = jest.spyOn(clientUserApplicationNull, 'once');
    const commandCollection = new Collection<string, Command>();
    addReadyEventToClient(clientUserApplicationNull, commandCollection);
    const callback = clientOnSpy.mock.calls[0][1];
    const callbackReturnVal = await callback();
    expect(callbackReturnVal).toBeUndefined();
  });

  test('sets commands if application of bot and a logged in client user exists', async () => {
    const clientOnSpy = jest.spyOn(client, 'once');
    const commandCollection = new Collection<string, Command>();
    addReadyEventToClient(client, commandCollection);
    const callback = clientOnSpy.mock.calls[0][1];
    await callback();
    expect(client.application.commands.set).toHaveBeenCalled();    
  });
});