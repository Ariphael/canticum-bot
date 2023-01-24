import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { executeDisconnect } from "../commands/disconnect";
import { getClientMock } from "../mocks/mocks";


describe('disconnect command', () => {
  const client = getClientMock();
  const interaction = ({
    guild: {
      id: String,
    },
    reply: jest.fn(),
  } as unknown) as ChatInputCommandInteraction<CacheType>;

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test('calls interaction.reply with ephemeral flag enabled if there does not exist a voice channel connection (executeDisconnect called directly)', async () => {
    expect.assertions(4);
    await executeDisconnect(client, interaction, -1); 
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: false,      
    });
    expect(interaction.reply).not.toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object),       
    });
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: true,
    });
  });

  test('calls interaction.reply with ephemeral flag set to default value (false) if there exists avoice channel connection (executeDisconnect called directly)', async () => {
    expect.assertions(4);
    await executeDisconnect(client, interaction, 1);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).not.toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: true,
    });  
    expect(interaction.reply).not.toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
      ephemeral: false,
    });  
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String), 
      components: expect.any(Object), 
      embeds: expect.any(Object), 
    });    
  })
});