import { doHandleSlashCommand } from '../listeners/interactionCreate';
import { getChatInputCommandInteractionMock } from '../mocks/interactionCreate.listener.mocks';
import { 
  getClientMock, 
  getInteractionNotChatInputCommandMock, 
  getSlashCommandMock 
} from '../mocks/mocks';

describe('interactionCreate listener tests', () => {
  const interactionNotChatInputCommand = getInteractionNotChatInputCommandMock();
  const interaction = getChatInputCommandInteractionMock();
  const client = getClientMock();
  const slashCommandA = getSlashCommandMock();
  const slashCommandB = getSlashCommandMock();
  const slashCommandC = getSlashCommandMock();

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('returns if interaction is not a chat input command', () => {
    doHandleSlashCommand([], client, interactionNotChatInputCommand);
    expect(interactionNotChatInputCommand.reply).toHaveBeenCalledTimes(0);
    expect(slashCommandA.run).toHaveBeenCalledTimes(0);
  });

  test('calls interaction.reply correctly if there are no commands', () => {
    interaction.commandName = "";
    doHandleSlashCommand([], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({ 
      content: expect.any(String),
      ephemeral: expect.any(Boolean)
    });
    expect(slashCommandA.run).toHaveBeenCalledTimes(0);
    expect(slashCommandB.run).toHaveBeenCalledTimes(0);
    expect(slashCommandC.run).toHaveBeenCalledTimes(0);
  });

  test('calls interaction.reply correctly if interaction.commandName does not match any commands (>1 command)', () => {
    slashCommandA.name = 'dummy1';
    slashCommandB.name = 'dummy2';
    slashCommandC.name = 'dummy3';
    interaction.commandName = 'dummy';
    doHandleSlashCommand([slashCommandA, slashCommandB, slashCommandC], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({ 
      content: expect.any(String),
      ephemeral: expect.any(Boolean)
    });
    expect(slashCommandA.run).toHaveBeenCalledTimes(0);
    expect(slashCommandB.run).toHaveBeenCalledTimes(0);
    expect(slashCommandC.run).toHaveBeenCalledTimes(0);
  });

  test('calls interaction.reply correctly if interaction.commandName does not match any commands (=1 command)', () => {
    slashCommandA.name = 'dummy1';
    interaction.commandName = 'dummy';
    doHandleSlashCommand([slashCommandA], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({ 
      content: expect.any(String),
      ephemeral: expect.any(Boolean)
    });
    expect(slashCommandA.run).toHaveBeenCalledTimes(0);
  });

  test('executes correct run function if interaction.commandName matches multiple commands (slashCommandA.run)', () => {
    slashCommandA.name = 'dummy1';
    slashCommandB.name = 'dummy1';
    slashCommandC.name = 'dummy1';
    interaction.commandName = 'dummy1';
    doHandleSlashCommand([slashCommandA, slashCommandB, slashCommandC], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(0);
    expect(slashCommandA.run).toHaveBeenCalledTimes(1);
    expect(slashCommandB.run).toHaveBeenCalledTimes(0);
    expect(slashCommandC.run).toHaveBeenCalledTimes(0);
  });

  test('executes correct run function if interaction.commandName matches multiple commands (slashCommandB.run)', () => {
    slashCommandA.name = 'dummy1';
    slashCommandB.name = 'dummy1';
    slashCommandC.name = 'dummy1';
    interaction.commandName = 'dummy1';
    doHandleSlashCommand([slashCommandB, slashCommandC, slashCommandA], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(0);
    expect(slashCommandA.run).toHaveBeenCalledTimes(0);
    expect(slashCommandB.run).toHaveBeenCalledTimes(1);
    expect(slashCommandC.run).toHaveBeenCalledTimes(0);
  });

  test('executes correct run function if interaction.commandName matches multiple commands (slashCommandC.run)', () => {
    slashCommandA.name = 'dummy1';
    slashCommandB.name = 'dummy1';
    slashCommandC.name = 'dummy1';
    interaction.commandName = 'dummy1';
    doHandleSlashCommand([slashCommandC, slashCommandB, slashCommandA], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(0);
    expect(slashCommandA.run).toHaveBeenCalledTimes(0);
    expect(slashCommandB.run).toHaveBeenCalledTimes(0);
    expect(slashCommandC.run).toHaveBeenCalledTimes(1);
  });

  test('executes run function in success case', async () => {
    slashCommandA.name = 'dummy1';
    interaction.commandName = 'dummy1';
    await doHandleSlashCommand([slashCommandA], client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(0);
    expect(slashCommandA.run).toHaveBeenCalledTimes(1);
  });
});
