import * as helpButtonsFile from '../buttons/help.buttons';
import { prevButtonId, nextButtonId } from '../buttons/buttons';
import { Button, HelpPageInfo } from '../buttons/button-interface';
import { 
  Awaitable,
  ButtonInteraction, 
  CacheType, 
  GuildTextBasedChannel, 
  InteractionCollector, 
  MessageComponentInteraction, 
  SelectMenuInteraction 
} from 'discord.js';

type interactionCollectorType = InteractionCollector<ButtonInteraction<CacheType> |
                                SelectMenuInteraction<CacheType>>;

describe('helpButtonsFile.executeHelpButton', () => {
  const iPrevButton = ({
    customId: prevButtonId,
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>;

  const iNextButton = ({
    customId: nextButtonId,
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>;

  const interactionCollector = ({
    on: jest.fn(),
  } as unknown) as interactionCollectorType;

  const guildTextBasedChannel = ({
    createMessageComponentCollector: jest.fn(() => {
      return interactionCollector;
    }), 
  } as unknown) as GuildTextBasedChannel;

  const helpButtons = ({
    row: {
      components: [{
        setDisabled: jest.fn(),
      }, {
        setDisabled: jest.fn(),
      }]
    }
  } as unknown) as Button;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('correctly calls createMessageComponentCollector', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 1,
    } as unknown) as HelpPageInfo;
    helpButtonsFile.executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(guildTextBasedChannel.createMessageComponentCollector).toHaveBeenCalledTimes(1);
    expect(guildTextBasedChannel.createMessageComponentCollector)
      .toHaveBeenCalledWith(expect.objectContaining({ filter: expect.any(Function) }));
    expect(guildTextBasedChannel.createMessageComponentCollector) 
      .toHaveBeenCalledWith(expect.objectContaining({ time: expect.any(Number) }));
  });

  test('correctly calls collector.on', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 1,
    } as unknown) as HelpPageInfo;
    helpButtonsFile.executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(interactionCollector.on).toHaveBeenCalledTimes(1);
    expect(interactionCollector.on).toHaveBeenNthCalledWith(1, 'collect', expect.any(Function));
  });

  test('calls helpButtonsFile.updateButtonMessage with correct args', () => {
    const pageInfo = ({
      page: 2, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    jest
      .spyOn(interactionCollector, 'on')
      .mockImplementationOnce(
        (eventStr: string, callback): interactionCollectorType => {
          callback(iNextButton);
          return interactionCollector;
        }
      );
    
    jest.spyOn(helpButtonsFile, "updateButtonMessage");

    helpButtonsFile.executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(helpButtonsFile.updateButtonMessage).toBeCalledTimes(1);
    expect(helpButtonsFile.updateButtonMessage).toBeCalledWith(helpButtons.row.components, pageInfo, iNextButton);  
  })
});

describe('helpButtonsFile.updateButtonMessage', () => {
  const iPrevButton = ({
    customId: prevButtonId,
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>;

  const iNextButton = ({
    customId: nextButtonId,
    update: jest.fn(),
  } as unknown) as MessageComponentInteraction<CacheType>;

  const helpButtons = ({
    row: {
      components: [{
        setDisabled: jest.fn(),
      }, {
        setDisabled: jest.fn(),
      }]
    }
  } as unknown) as Button;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('increments page count by 1 when next button is pressed', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const pageNum = pageInfo.page;

    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);   
    expect(pageInfo.page).toBe(pageNum + 1);
  });

  test('enables prev button when next button is pressed', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const prevButtonComponent = helpButtons.row.components[0];

    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton); 
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton); 
    expect(prevButtonComponent.setDisabled).toBeCalledTimes(2);
    expect(prevButtonComponent.setDisabled).toBeCalledWith(false);
  });

  test('disables next button on last page', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const pageNum = pageInfo.page;
    const nextButtonComponent = helpButtons.row.components[1];

    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);   

    expect(nextButtonComponent.setDisabled).toBeCalledTimes(1);
    expect(nextButtonComponent.setDisabled).toBeCalledWith(true);
  });

  test('decrements page count when prev button is pressed', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const pageNum = pageInfo.page;

    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton);   
    expect(pageInfo.page).toBe(pageNum - 1);    
  });

  test('enables next button when prev button is pressed', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const nextButtonComponent = helpButtons.row.components[1];

    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
    expect(nextButtonComponent.setDisabled).toBeCalledTimes(2);
    expect(nextButtonComponent.setDisabled).toBeCalledWith(false);    
  });

  test('disables prev button on first page', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const prevButtonComponent = helpButtons.row.components[0]; 
    
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton); 
    expect(prevButtonComponent.setDisabled).toBeCalledTimes(1); 
    expect(prevButtonComponent.setDisabled).toBeCalledWith(true);
  });

  test('calls i.update (prev button pressed)', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo; 
    
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iPrevButton);
    expect(iPrevButton.update).toBeCalledTimes(1);    
  });

  test('calls i.update (next button pressed)', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;
    
    helpButtonsFile.updateButtonMessage(helpButtons.row.components, pageInfo, iNextButton);
    expect(iNextButton.update).toBeCalledTimes(1);    
  });
});
