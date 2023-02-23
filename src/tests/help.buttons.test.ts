import { helpButtons, getPageNumber, getNumPages, resetPageNumber } from '../buttons/help.buttons';
import { numPages } from '../embeds/helpEmbeds';
import { 
  getHelpPrevButtonMock, 
  getHelpNextButtonMock, 
  getInteractionCollectorMock, 
  getGuildTextBasedChannelMock, 
  getHelpButtonsMock,
  getMessageComponentInteractionWithCustomIdMock
} from '../mocks/mocks';
import { HelpPageInfo } from '../interfaces/button-interface';
import { 
  ActionRowBuilder,
  Awaitable,
  ButtonBuilder,
  ButtonInteraction, 
  CacheType, 
  CollectorFilter, 
  EmbedBuilder, 
  InteractionCollector, 
  MessageComponentInteraction, 
  SelectMenuInteraction 
} from 'discord.js';

type interactionCollectorType = InteractionCollector<ButtonInteraction<CacheType> |
                                SelectMenuInteraction<CacheType>>;

const iNextButton = getHelpNextButtonMock();
const interactionCollector = getInteractionCollectorMock();
const guildTextBasedChannel = getGuildTextBasedChannelMock(interactionCollector);
const messageComponentInteractionPrevButton = 
  getMessageComponentInteractionWithCustomIdMock(helpButtons.buttonId[0]);
const messageComponentInteractionNextButton = 
  getMessageComponentInteractionWithCustomIdMock(helpButtons.buttonId[1]);
const messageComponentInteractionUnknownButton = 
  getMessageComponentInteractionWithCustomIdMock(
    helpButtons.buttonId[0] + helpButtons.buttonId[1]);

const buttonBuilder = ({
  setDisabled: jest.fn(),
} as unknown) as ButtonBuilder;

beforeEach(() => {
  jest.clearAllMocks();
  resetPageNumber();
});

afterEach(() => {
  jest.clearAllMocks();
  resetPageNumber();
});

describe('help buttons tests', () => {
  test('updates message component after next button is pressed', async () => {
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
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
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
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
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    const oldPageNum = getPageNumber();
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(getPageNumber()).toBe(oldPageNum - 1);
  });

  test('enables next button after prev button pressed', async () => {
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
    const nextButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[1], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(helpButtons.row.components[1].setDisabled).toHaveBeenCalledTimes(1);
    expect(nextButtonSetDisabledSpy).toHaveBeenCalledWith(false);
  });
  
  test('increments page number by 1 after next button is pressed', async () => {
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    const oldPageNum = getPageNumber();
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    expect(getPageNumber()).toBe(oldPageNum + 1);
  });

  test('enables prev button after next button pressed', async () => {
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
    const prevButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[0], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    expect(prevButtonSetDisabledSpy).toHaveBeenCalledTimes(1);
    expect(prevButtonSetDisabledSpy).toHaveBeenCalledWith(false);
  });

  test('disables prev button when page number is 1', async () => {
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
    const prevButtonSetDisabledSpy = jest.spyOn(helpButtons.row.components[0], 'setDisabled');
    helpButtons.handleInteraction(guildTextBasedChannel);
    const interactionCollectorOnListener = interactionCollectorOnSpy.mock.calls[0][1];
    await interactionCollectorOnListener(messageComponentInteractionNextButton);
    await interactionCollectorOnListener(messageComponentInteractionPrevButton);
    expect(prevButtonSetDisabledSpy).toHaveBeenCalledTimes(2);
    expect(prevButtonSetDisabledSpy).toHaveBeenNthCalledWith(2, true);
  });

  test('disables next button when page number is the last page', async () => {
    const interactionCollectorOnSpy = jest.spyOn(interactionCollector, 'on');
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
  test('returns true if id of message component is equal to id of prev button', () => {
    const createMessageComponentCollectorSpy = 
      jest.spyOn(guildTextBasedChannel, 'createMessageComponentCollector')
        .mockImplementationOnce(() => interactionCollector);
    helpButtons.handleInteraction(guildTextBasedChannel);
    type collectorFilterType = CollectorFilter<[ButtonInteraction<CacheType>]>;
    const filterFn =
      (createMessageComponentCollectorSpy.mock.calls[0][0].filter) as collectorFilterType;
    expect(filterFn(messageComponentInteractionPrevButton)).toBe(true);
  });
  test('returns true if id of message component is equal to id of next button', () => {
    const createMessageComponentCollectorSpy = 
      jest.spyOn(guildTextBasedChannel, 'createMessageComponentCollector')
        .mockImplementationOnce(() => interactionCollector);
    helpButtons.handleInteraction(guildTextBasedChannel);
    type collectorFilterType = CollectorFilter<[ButtonInteraction<CacheType>]>;
    const filterFn =
      (createMessageComponentCollectorSpy.mock.calls[0][0].filter) as collectorFilterType;
    expect(filterFn(messageComponentInteractionNextButton)).toBe(true);
  });
  test('returns false if id of message component is not equal to id of prev or next button', () => {
    const createMessageComponentCollectorSpy = 
    jest.spyOn(guildTextBasedChannel, 'createMessageComponentCollector')
      .mockImplementationOnce(() => interactionCollector);
    helpButtons.handleInteraction(guildTextBasedChannel);
    type collectorFilterType = CollectorFilter<[ButtonInteraction<CacheType>]>;
    const filterFn =
      (createMessageComponentCollectorSpy.mock.calls[0][0].filter) as collectorFilterType;
    expect(filterFn(messageComponentInteractionUnknownButton)).toBe(false);    
  });
})

// describe('helpButtonsFile.executeHelpButton', () => {
//   const helpButtons = getHelpButtonsMock();

//   test('correctly calls createMessageComponentCollector', () => {
//     const pageInfo = ({
//       page: 1, 
//       maxPage: 1,
//     } as unknown) as HelpPageInfo;
//     helpButtonsFile.executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
//     expect(guildTextBasedChannel.createMessageComponentCollector).toHaveBeenCalledTimes(1);
//     expect(guildTextBasedChannel.createMessageComponentCollector)
//       .toHaveBeenCalledWith(expect.objectContaining({ filter: expect.any(Function) }));
//     expect(guildTextBasedChannel.createMessageComponentCollector) 
//       .toHaveBeenCalledWith(expect.objectContaining({ time: expect.any(Number) }));
//   });

//   test('correctly calls collector.on', () => {
//     const pageInfo = ({
//       page: 1, 
//       maxPage: 1,
//     } as unknown) as HelpPageInfo;
//     helpButtonsFile.executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
//     expect(interactionCollector.on).toHaveBeenCalledTimes(1);
//     expect(interactionCollector.on).toHaveBeenNthCalledWith(1, 'collect', expect.any(Function));
//   });

//   test('calls helpButtonsFile.updateButtonMessage with correct args', () => {
//     const pageInfo = ({
//       page: 2, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     jest
//       .spyOn(interactionCollector, 'on')
//       .mockImplementationOnce(
//         (eventStr: string, callback): interactionCollectorType => {
//           callback(iNextButton);
//           return interactionCollector;
//         }
//       );
    
//     jest.spyOn(helpButtonsFile, "updateButtonMessage");

//     helpButtonsFile.executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
//     expect(helpButtonsFile.updateButtonMessage).toBeCalledTimes(1);
//     expect(helpButtonsFile.updateButtonMessage).toBeCalledWith(helpButtons.row.components, pageInfo, iNextButton);  
//   })
// });

// describe('helpButtonsFile.updateButtonMessage', () => {
//   const iPrevButton = getHelpPrevButtonMock();
//   const helpButtons = getHelpButtonsMock();

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('increments page count by 1 when next button is pressed', () => {
//     const pageInfo = ({
//       page: 1, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     const pageNum = pageInfo.page;

//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);   
//     expect(pageInfo.page).toBe(pageNum + 1);
//   });

//   test('enables prev button when next button is pressed', () => {
//     const pageInfo = ({
//       page: 1, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     const prevButtonComponent = helpButtons.row.components[0];

//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton); 
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton); 
//     expect(prevButtonComponent.setDisabled).toBeCalledTimes(2);
//     expect(prevButtonComponent.setDisabled).toBeCalledWith(false);
//   });

//   test('disables next button on last page', () => {
//     const pageInfo = ({
//       page: 1, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     const nextButtonComponent = helpButtons.row.components[1];

//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);   

//     expect(nextButtonComponent.setDisabled).toBeCalledTimes(1);
//     expect(nextButtonComponent.setDisabled).toBeCalledWith(true);
//   });

//   test('decrements page count when prev button is pressed', () => {
//     const pageInfo = ({
//       page: 3, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     const pageNum = pageInfo.page;

//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton);   
//     expect(pageInfo.page).toBe(pageNum - 1);    
//   });

//   test('enables next button when prev button is pressed', () => {
//     const pageInfo = ({
//       page: 3, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     const nextButtonComponent = helpButtons.row.components[1];

//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
//     expect(nextButtonComponent.setDisabled).toBeCalledTimes(2);
//     expect(nextButtonComponent.setDisabled).toBeCalledWith(false);    
//   });

//   test('disables prev button on first page', () => {
//     const pageInfo = ({
//       page: 3, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;

//     const prevButtonComponent = helpButtons.row.components[0]; 
    
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
//     expect(prevButtonComponent.setDisabled).toBeCalledTimes(1); 
//     expect(prevButtonComponent.setDisabled).toBeCalledWith(true);
//   });

//   test('calls i.update (prev button pressed)', () => {
//     const pageInfo = ({
//       page: 3, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo; 
    
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton);
//     expect(iPrevButton.update).toBeCalledTimes(1);    
//   });

//   test('calls i.update (next button pressed)', () => {
//     const pageInfo = ({
//       page: 1, 
//       maxPage: 3,
//     } as unknown) as HelpPageInfo;
    
//     helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);
//     expect(iNextButton.update).toBeCalledTimes(1);    
//   });
// });

// describe('helpButtons', () => {
//   const interactionCollector = getInteractionCollectorMock();

//   const guildTextBasedChannel = getGuildTextBasedChannelMock(interactionCollector);

//   test('handleInteraction calls executeHelpButtons', () => {
//     jest.spyOn(helpButtonsFile.helpButtons, 'handleInteraction');
//     jest.spyOn(helpButtonsFile, 'executeHelpButton')

//     helpButtonsFile.helpButtons.handleInteraction(guildTextBasedChannel);
//     expect(helpButtonsFile.executeHelpButton).toBeCalledTimes(1);
//   });
// });
