import { executeHelpButton } from '../buttons/help.buttons';
import { prevButtonId, nextButtonId } from '../buttons/help.buttons';
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

describe('executePrevButton', () => {
  const iPrevButton = ({
    customId: prevButtonId,
  } as unknown) as MessageComponentInteraction<CacheType>;

  const iNextButton = ({
    customId: nextButtonId,
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
    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
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
    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(interactionCollector.on).toHaveBeenCalledTimes(2);
    expect(interactionCollector.on).toHaveBeenNthCalledWith(1, 'collect', expect.any(Function));
    expect(interactionCollector.on).toHaveBeenNthCalledWith(2, 'end', expect.any(Function));
  });

  test('increments page count by 1 when next button is pressed', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const pageNum = pageInfo.page;

    jest
      .spyOn(interactionCollector, 'on')
      .mockImplementation(
        (_eventStr: string, callback): interactionCollectorType => {
          callback(iNextButton);
          return interactionCollector;
        }
      );

    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel);   
    expect(pageInfo.page).toBe(pageNum + 1);
    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(pageInfo.page).toBe(pageNum + 2);
  });

  test('enables prev button when next button is pressed', () => {
    const pageInfo = ({
      page: 1, 
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
    
    jest.spyOn(helpButtons.row.components[0], 'setDisabled');

    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(helpButtons.row.components[0].setDisabled).toBeCalledTimes(1); 
    expect(helpButtons.row.components[0].setDisabled).toBeCalledWith(false);
  });

  test('next button is disabled on last page', () => {
    const pageInfo = ({
      page: 1, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    jest
      .spyOn(interactionCollector, 'on')
      .mockImplementation(
        (eventStr: string, callback): interactionCollectorType => {
          callback(iNextButton);
          return interactionCollector;
        }
      );
    
    jest.spyOn(helpButtons.row.components[0], 'setDisabled');
    jest.spyOn(helpButtons.row.components[1], 'setDisabled');

    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(helpButtons.row.components[0].setDisabled).toBeCalledTimes(2); 
    expect(helpButtons.row.components[0].setDisabled).toBeCalledWith(false);  
    expect(helpButtons.row.components[1].setDisabled).toBeCalledTimes(1); 
    expect(helpButtons.row.components[1].setDisabled).toBeCalledWith(true);  
  });

  test('decrements page count by 1 when prev button is pressed', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    const pageNum = pageInfo.page;

    jest
      .spyOn(interactionCollector, 'on')
      .mockImplementation(
        (eventStr: string, callback): interactionCollectorType => {
          callback(iPrevButton);
          return interactionCollector;
        }
      );

    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel);     
    expect(pageInfo.page).toBe(pageNum - 1);
    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(pageInfo.page).toBe(pageNum - 2);    
  });

  test('enables next button when prev button is pressed', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    jest
      .spyOn(interactionCollector, 'on')
      .mockImplementationOnce(
        (eventStr: string, callback): interactionCollectorType => {
          callback(iPrevButton);
          return interactionCollector;
        }
      );
    
    jest.spyOn(helpButtons.row.components[1], 'setDisabled');

    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(helpButtons.row.components[1].setDisabled).toBeCalledTimes(1); 
    expect(helpButtons.row.components[1].setDisabled).toBeCalledWith(false);
  });

  test('disables prev button on first page', () => {
    const pageInfo = ({
      page: 3, 
      maxPage: 3,
    } as unknown) as HelpPageInfo;

    jest
      .spyOn(interactionCollector, 'on')
      .mockImplementationOnce(
        (eventStr: string, callback): interactionCollectorType => {
          callback(iPrevButton);
          return interactionCollector;
        }
      );
    
    jest.spyOn(helpButtons.row.components[1], 'setDisabled');

    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    executeHelpButton(helpButtons.row.components, pageInfo, guildTextBasedChannel); 
    expect(helpButtons.row.components[1].setDisabled).toBeCalledTimes(2); 
    expect(helpButtons.row.components[1].setDisabled).toBeCalledWith(false);
    expect(helpButtons.row.components[0].setDisabled).toBeCalledTimes(1); 
    expect(helpButtons.row.components[0].setDisabled).toBeCalledWith(true);
  });
});