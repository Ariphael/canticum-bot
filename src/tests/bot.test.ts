import { startCanticum } from '../bot';
import { getClientMock } from '../mocks/bot.test.mocks';

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('bot.ts tests', () => {
  const client = getClientMock();

  test('logs into discord with client\'s token', async () => {
    await startCanticum(client);
    expect(client.login).toHaveBeenCalledTimes(1);
    expect(client.login).toHaveBeenCalledWith(expect.any(String));
  });
})