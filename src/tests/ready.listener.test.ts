import { doHandleReady } from '../listeners/ready';
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
    expect(client.application.commands.set).toHaveReturned();
  });

  test('console logs client.user.tag after client.application.commands.set (doHandleReady directly called)', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await doHandleReady(client);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`${client.user.tag}`));
  });
});