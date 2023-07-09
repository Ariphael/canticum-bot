import { ChatInputCommandInteraction, Collection } from 'discord.js';
import { addInteractionCreateEventToClient } from '../events/interactionCreate';
import { Command } from '../interfaces/command-interface';
import { 
  getClientMock, 
  getChatInputCommandInteractionMock, 
  getInteractionNotCommandMock, 
  getContextMenuCommandInteractionMock
} from '../mocks/interactionCreate.listener.mocks';
import { 
  getSlashCommandMock 
} from '../mocks/mocks';

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('interactionCreate listener tests', () => {
  const interactionNotCommand = getInteractionNotCommandMock();
  const interactionNotChatInputCommand = getContextMenuCommandInteractionMock();
  const interaction = getChatInputCommandInteractionMock();
  const client = getClientMock();

  test('does nothing if interaction is not from a command', async () => {
    const clientOnSpy = jest.spyOn(client, 'on');
    addInteractionCreateEventToClient(client, null);
    const clientOnCallbackFn = clientOnSpy.mock.calls[0][1];
    await clientOnCallbackFn(interactionNotCommand);
    expect(interactionNotCommand.reply).not.toHaveBeenCalled();
  });

  test('does nothing if interaction is not from a chat input command', async () => {
    const clientOnSpy = jest.spyOn(client, 'on');
    addInteractionCreateEventToClient(client, null);
    const clientOnCallbackFn = clientOnSpy.mock.calls[0][1];
    await clientOnCallbackFn(interactionNotChatInputCommand);
    expect(interactionNotCommand.reply).not.toHaveBeenCalled();
  });

  test('sends a message to channel if cannot find command in command collection', async () => {
    const clientOnSpy = jest.spyOn(client, 'on');
    const commandCollection = new Collection<string, Command>();
    addInteractionCreateEventToClient(client, commandCollection);
    const clientOnCallbackFn = clientOnSpy.mock.calls[0][1];
    await clientOnCallbackFn(interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      ephemeral: expect.any(Boolean),
    });
  });

  test('sends a message to channel if an exception is thrown while command is running', async () => {
    const clientOnSpy = jest.spyOn(client, 'on');
    const commandCollection = new Collection<string, Command>();
    commandCollection.set('example', {
      name: 'name', 
      description: 'description',
      run: async (_client, _interaction) => {
        throw new Error();
      }
    });
    addInteractionCreateEventToClient(client, commandCollection);
    const clientOnCallbackFn = clientOnSpy.mock.calls[0][1];
    await clientOnCallbackFn(interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      ephemeral: expect.any(Boolean),
    });    
  });
});
