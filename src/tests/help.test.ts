import { InteractionResponse } from 'discord.js';
import { help } from '../commands/help';
import { 
  getChatInputCommandInteractionMock, 
  getCommandInteractionOptionMock 
} from '../mocks/help.test.mocks';
import { getClientMock } from '../mocks/mocks';

const client = getClientMock();
const interaction = getChatInputCommandInteractionMock();
const commandInteractionOption = getCommandInteractionOptionMock();

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('help', () => {
  test('sends a message to channel with one component if command option is left blank', async () => {
    jest.spyOn(interaction.options, 'get').mockReturnValueOnce(null);
    await help.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [expect.any(Object)],
      embeds: [expect.any(Object)],
    })
  });

  test('sends a message to channel with no components if command option is not left blank', async () => {
    jest.spyOn(interaction.options, 'get').mockReturnValueOnce(commandInteractionOption);
    jest.spyOn(interaction.options, 'getString').mockReturnValueOnce('command');
    await help.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    });
  });
})