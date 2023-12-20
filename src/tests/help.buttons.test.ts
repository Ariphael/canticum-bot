import { helpButtons, getPageNumber, getNumPages, resetPageNumber } from '../buttons/help.buttons';
import { 
  getInteractionCollectorMock, 
  getGuildTextBasedChannelMock, 
  getMessageComponentInteractionWithCustomIdMock
} from '../mocks/mocks';
import { 
  ButtonBuilder,
  ButtonInteraction, 
  CacheType, 
  CollectorFilter
} from 'discord.js';

const interactionCollector = getInteractionCollectorMock();
const guildTextBasedChannel = getGuildTextBasedChannelMock(interactionCollector);
const messageComponentInteractionPrevButton = 
  getMessageComponentInteractionWithCustomIdMock(helpButtons.buttonId[0]);
const messageComponentInteractionNextButton = 
  getMessageComponentInteractionWithCustomIdMock(helpButtons.buttonId[1]);
const messageComponentInteractionUnknownButton = 
  getMessageComponentInteractionWithCustomIdMock(
    helpButtons.buttonId[0] + helpButtons.buttonId[1]);

beforeEach(() => {
  jest.clearAllMocks();
  resetPageNumber();
});

afterEach(() => {
  jest.clearAllMocks();
  resetPageNumber();
});

describe('help buttons tests', () => {
  const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');

  test('updates message component after next button is pressed', async () => {
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    expect(messageComponentInteractionNextButton.update).toHaveBeenCalledTimes(1);
    expect(messageComponentInteractionNextButton.update).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [expect.any(Object)],
      embeds: [expect.any(Object)],
    });
  });

  test('updates message component after prev button is pressed', async () => {
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(messageComponentInteractionPrevButton.update).toHaveBeenCalledTimes(1);
    expect(messageComponentInteractionPrevButton.update).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [expect.any(Object)],
      embeds: [expect.any(Object)],
    });
  });

  test('decreases page number by 1 after prev button is pressed', async () => {
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    const oldPageNum = getPageNumber();
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(getPageNumber()).toBe(oldPageNum - 1);
  });

  test('enables next button after prev button pressed', async () => {
    const nextButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[1], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(helpButtons.row.components[1].setDisabled).toHaveBeenCalledTimes(1);
    expect(nextButtonSetDisabledSpy).toHaveBeenCalledWith(false);
  });
  
  test('increments page number by 1 after next button is pressed', async () => {
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    const oldPageNum = getPageNumber();
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    expect(getPageNumber()).toBe(oldPageNum + 1);
  });

  test('enables prev button after next button pressed', async () => {
    const prevButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[0], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    expect(prevButtonSetDisabledSpy).toHaveBeenCalledTimes(1);
    expect(prevButtonSetDisabledSpy).toHaveBeenCalledWith(false);
  });

  test('disables prev button when page number is 1', async () => {
    const prevButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[0], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(prevButtonSetDisabledSpy).toHaveBeenCalledTimes(2);
    expect(prevButtonSetDisabledSpy).toHaveBeenNthCalledWith(2, true);
  });

  test('disables next button when page number is the last page', async () => {
    const nextButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[1], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    const maxPageNumber = getNumPages();
    while (getPageNumber() !== maxPageNumber)
      await interactionCollectorOnListener(messageComponentInteractionNextButton);
    expect(nextButtonSetDisabledSpy).toHaveBeenCalledTimes(maxPageNumber - 1);
    expect(nextButtonSetDisabledSpy).toHaveBeenNthCalledWith(maxPageNumber - 1, true);       
  });
});

describe('collector filter', () => {
  const createMessageComponentCollectorSpy = 
    jest.spyOn(guildTextBasedChannel, 'createMessageComponentCollector')
      .mockImplementationOnce(() => interactionCollector);

  test.each([
    ['prev', messageComponentInteractionPrevButton],
    ['next', messageComponentInteractionNextButton]
  ])(`returns true if id of message component is equal to id of %s`, (_label, buttonInteraction) => {
    helpButtons.handleInteraction(guildTextBasedChannel);
    type collectorFilterType = CollectorFilter<[ButtonInteraction<CacheType>]>;
    const filterFn =
      (createMessageComponentCollectorSpy.mock.calls[0][0].filter) as collectorFilterType;
    expect(filterFn(buttonInteraction)).toBe(true);    
  });

  test('returns false if id of message component is not equal to id of prev or next button', () => {
    helpButtons.handleInteraction(guildTextBasedChannel);
    type collectorFilterType = CollectorFilter<[ButtonInteraction<CacheType>]>;
    const filterFn =
      (createMessageComponentCollectorSpy.mock.calls[0][0].filter) as collectorFilterType;
    expect(filterFn(messageComponentInteractionUnknownButton)).toBe(false);    
  });
})
