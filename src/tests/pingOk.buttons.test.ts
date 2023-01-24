import { pingOk, executePingOk } from '../buttons/pingOk';
import { 
  getInteractionCollectorMock, 
  getGuildTextBasedChannelMock, 
  getMessageComponentInteractionMock 
} from '../mocks/mocks';

describe('pingOk Button Tests', () => {
  const messageComponentInteraction = getMessageComponentInteractionMock();
  const interactionCollector = getInteractionCollectorMock();
  const channel = getGuildTextBasedChannelMock(interactionCollector);

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