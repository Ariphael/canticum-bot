import { 
  addSongRequest, 
  dequeue, 
  swapQueuePositions, 
  getMusicQueue, 
  clearQueue 
} from '../queue/songQueue';

beforeEach(() => {
  jest.restoreAllMocks();
  clearQueue();
});

afterEach(() => {
  jest.restoreAllMocks();
  clearQueue();
});

describe('addSongRequest', () => {
  test('addSongRequest correctly pushes a song request to queue', () => {
    const oldQueueLength: number = getMusicQueue().length;
    const newQueueLength: number = addSongRequest('musicTitle', 'musicLink');
    expect(getMusicQueue()).toStrictEqual([{ 
      'musicTitle': 'musicTitle',
      'musicLink': 'musicLink',
    }]);
    expect(newQueueLength).toBe(oldQueueLength + 1);
  })

  test('addSongRequest correctly pushes multiple song requests to queue', () => {
    const oldQueueLength: number = getMusicQueue().length;
    const newQueueLengths: number[] = [
      addSongRequest('musicTitle1', 'musicLink1'),
      addSongRequest('musicTitle2', 'musicLink2'),
      addSongRequest('musicTitle3', 'musicLink3'),
    ];
    expect(getMusicQueue()).toStrictEqual([
      { 
        'musicTitle': 'musicTitle1',
        'musicLink': 'musicLink1',
      }, { 
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2', 
      }, { 
        'musicTitle': 'musicTitle3',
        'musicLink': 'musicLink3',
      },
    ]);
    expect(newQueueLengths[0]).toBe(oldQueueLength + 1);
    expect(newQueueLengths[1]).toBe(oldQueueLength + 2);
    expect(newQueueLengths[2]).toBe(oldQueueLength + 3);
  });
});

describe('dequeue', () => {
  test('dequeue returns undefined if queue is empty', () => {
    expect(dequeue()).toStrictEqual(undefined);
  });

  test('dequeue correctly returns and removes first element of array (1 element)', () => {
    addSongRequest('musicTitle', 'musicLink');
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle',
      'musicLink': 'musicLink',
    });
    expect(getMusicQueue()).toStrictEqual([]);
  });

  test('dequeue correctly returns and removes first element of array (many elements)', () => {
    addSongRequest('musicTitle1', 'musicLink1');
    addSongRequest('musicTitle2', 'musicLink2');
    addSongRequest('musicTitle3', 'musicLink3');
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle1',
      'musicLink': 'musicLink1',
    });
    expect(getMusicQueue()).toStrictEqual([
      { 
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2' 
      }, { 
        'musicTitle': 'musicTitle3',
        'musicLink': 'musicLink3' 
      },
    ]);
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle2',
      'musicLink': 'musicLink2' 
    });
    expect(getMusicQueue()).toStrictEqual([{
      'musicTitle': 'musicTitle3',
      'musicLink': 'musicLink3' 
    }]);
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle3',
      'musicLink': 'musicLink3' 
    });
    expect(getMusicQueue()).toStrictEqual([]);
  });
});

describe('swapQueuePositions', () => {
  test('returns null and calls console.log if positionA parameter is less than 0', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    expect(swapQueuePositions(-1, 0)).toStrictEqual(null);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String));
  });

  test('returns null and calls console.log if positionB parameter is less than 0', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    expect(swapQueuePositions(0, -1)).toStrictEqual(null);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String));
  });

  test('returns null and calls console.log if positionA and positionB paramter is less than 0', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    expect(swapQueuePositions(-1, -1)).toStrictEqual(null);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String));    
  });

  test('correctly swaps two elements in the queue', () => {
    addSongRequest('musicTitle1', 'musicLink1');
    addSongRequest('musicTitle2', 'musicLink2');
    addSongRequest('musicTitle3', 'musicLink3');
    const modifiedMusicQueue = swapQueuePositions(1, 2);
    expect(modifiedMusicQueue).toStrictEqual([
      {
        'musicTitle': 'musicTitle1',
        'musicLink': 'musicLink1',
      }, {
        'musicTitle': 'musicTitle3',
        'musicLink': 'musicLink3',
      }, {
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2',
      },
    ]);
    expect(modifiedMusicQueue).toStrictEqual(getMusicQueue());
  });

  test('queue is unmodified if positionA = positionB', () => {
    addSongRequest('musicTitle1', 'musicLink1');
    addSongRequest('musicTitle2', 'musicLink2');
    addSongRequest('musicTitle3', 'musicLink3');
    const modifiedMusicQueue = swapQueuePositions(1, 1);
    expect(modifiedMusicQueue).toStrictEqual([
    {
      'musicTitle': 'musicTitle1',
      'musicLink': 'musicLink1',
    }, {
      'musicTitle': 'musicTitle2',
      'musicLink': 'musicLink2',
    }, {
      'musicTitle': 'musicTitle3',
      'musicLink': 'musicLink3',
    },
    ]);
    expect(modifiedMusicQueue).toStrictEqual(getMusicQueue());    
  });
});

describe('getMusicQueue', () => {
  test('returns music queue', () => {
    addSongRequest('musicTitle1', 'musicLink1');
    expect(getMusicQueue()).toStrictEqual([
      {
        'musicTitle': 'musicTitle1',
        'musicLink': 'musicLink1'
      },
    ]);   
    addSongRequest('musicTitle2', 'musicLink2');
    expect(getMusicQueue()).toStrictEqual([
      {
        'musicTitle': 'musicTitle1',
        'musicLink': 'musicLink1',
      }, {
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2',
      },
    ]);    
    addSongRequest('musicTitle3', 'musicLink3');
    expect(getMusicQueue()).toStrictEqual([
      {
        'musicTitle': 'musicTitle1',
        'musicLink': 'musicLink1',
      }, {
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2'
      }, {
        'musicTitle': 'musicTitle3',
        'musicLink': 'musicLink3',
      }
    ]);    
    dequeue();
    expect(getMusicQueue()).toStrictEqual([
      {
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2',
      }, {
        'musicTitle': 'musicTitle3',
        'musicLink': 'musicLink3'
      },
    ]); 
    swapQueuePositions(0, 1);
    expect(getMusicQueue()).toStrictEqual([
      {
        'musicTitle': 'musicTitle3',
        'musicLink': 'musicLink3',
      }, {
        'musicTitle': 'musicTitle2',
        'musicLink': 'musicLink2'
      },
    ]);     
  });
});

describe('clearQueue', () => {
  test('clears queue correctly', () => {
    addSongRequest('musicTitle1', 'musicLink1');
    addSongRequest('musicTitle2', 'musicLink2');
    addSongRequest('musicTitle3', 'musicLink3');
    expect(getMusicQueue()).not.toStrictEqual([]);
    clearQueue();
    expect(getMusicQueue()).toStrictEqual([]);        
  });
});