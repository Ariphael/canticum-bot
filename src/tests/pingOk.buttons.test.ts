import { pingOk, executePingOk, buttonId } from '../buttons/pingOk';
import { 
  ButtonInteraction, 
  CacheType, 
  CollectorFilter, 
  GuildTextBasedChannel, 
  InteractionCollector, 
  MessageComponentInteraction, 
  SelectMenuInteraction 
} from 'discord.js';

describe('pingOk Button Tests', () => {
  const messageComponentInteraction = ({
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>;

  const interactionCollector = ({
    on: jest.fn(),
  } as unknown) as  InteractionCollector<SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>>;
  
  const channel = ({
    createMessageComponentCollector: jest.fn(() => { 
      return interactionCollector; 
    }),
  } as unknown) as GuildTextBasedChannel;

  test('correctly calls createMessageComponentCollector (executePingOk called directly)', async () => {
    await executePingOk(channel);
    expect(channel.createMessageComponentCollector).toHaveBeenCalled();
    expect(channel.createMessageComponentCollector)
      .toHaveBeenCalledWith(expect.objectContaining({ filter: expect.any(Function) }));
    expect(channel.createMessageComponentCollector)
      .toHaveBeenCalledWith(expect.objectContaining({ time: expect.any(Number) }));
  });

  test('correctly calls collector.on (executePingOk called directly)', async () => {
    await executePingOk(channel);
    expect(interactionCollector.on).toHaveBeenCalled();
    expect(interactionCollector.on).toHaveBeenNthCalledWith(1, 'collect', expect.any(Function));
    expect(interactionCollector.on).toHaveBeenNthCalledWith(2, 'end', expect.any(Function));
  });

  test('correctly calls createMessageComponentCollector (executePingOk called by pingOk.handleInteraction)', async () => {
    await pingOk.handleInteraction(channel);
    expect(channel.createMessageComponentCollector).toHaveBeenCalled();
    expect(channel.createMessageComponentCollector)
      .toHaveBeenCalledWith(expect.objectContaining({ filter: expect.any(Function) }));
    expect(channel.createMessageComponentCollector)
      .toHaveBeenCalledWith(expect.objectContaining({ time: expect.any(Number) }));
  });

  test('correctly calls collector.on (executePingOk called by pingOk.handleInteraction)', async () => {
    await pingOk.handleInteraction(channel);
    expect(interactionCollector.on).toHaveBeenCalled();
    expect(interactionCollector.on).toHaveBeenNthCalledWith(1, 'collect', expect.any(Function));
    expect(interactionCollector.on).toHaveBeenNthCalledWith(2, 'end', expect.any(Function));
  });
});