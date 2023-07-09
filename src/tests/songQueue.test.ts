import { 
  addSongRequest, 
  dequeue, 
  swapQueuePositions, 
  clearQueue, 
  getMusicQueueLength,
  getMusicQueueItem
} from '../queue/musicQueue';

beforeEach(() => {
  clearQueue();
});

afterEach(() => {
  clearQueue();
});

describe('addSongRequest', () => {
  test('addSongRequest correctly pushes a song request to queue', () => {
    const oldQueueLength: number = getMusicQueueLength();
    const newQueueLength: number = addSongRequest('musicTitle', 'musicId');
    expect(newQueueLength).toBe(oldQueueLength + 1);
    expect(getMusicQueueItem(newQueueLength - 1)).toStrictEqual({
      'musicTitle': 'musicTitle',
      'musicId': 'musicId',
    });
  })

  test('pushes multiple songs to queue', () => {
    const oldQueueLength = getMusicQueueLength();
    const newQueueLengths = [
      addSongRequest('musicTitle1', 'musicId1'),
      addSongRequest('musicTitle2', 'musicId2'),
    ];
    expect(getMusicQueueItem(0)).toStrictEqual({
      'musicTitle': 'musicTitle1',
      'musicId': 'musicId1'
    });
    expect(getMusicQueueItem(1)).toStrictEqual({
      'musicTitle': 'musicTitle2',
      'musicId': 'musicId2'
    });
    expect(newQueueLengths[1]).toBe(newQueueLengths[0] + 1);
    expect(newQueueLengths[0]).toBe(oldQueueLength + 1);
  })
});

describe('dequeue', () => {
  test('returns undefined if queue is empty', () => {
    expect(dequeue()).toStrictEqual(undefined);
  });

  test('returns and removes first element of array (1 element)', () => {
    addSongRequest('musicTitle', 'musicId');
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle',
      'musicId': 'musicId',
    });
    expect(getMusicQueueLength()).toBe(0);
  });

  test('returns and removes first element of array (many elements)', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    addSongRequest('musicTitle3', 'musicId3');
    expect(getMusicQueueLength()).toBe(3);
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle1',
      'musicId': 'musicId1',
    });
    expect(getMusicQueueLength()).toBe(2);
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle2',
      'musicId': 'musicId2' 
    });
    expect(getMusicQueueLength()).toBe(1);
    expect(dequeue()).toStrictEqual({ 
      'musicTitle': 'musicTitle3',
      'musicId': 'musicId3' 
    });
    expect(getMusicQueueLength()).toBe(0);
  });
});

describe('swapQueuePositions', () => {
  test('returns false if positionA parameter is less than 0', () => {
    addSongRequest('musicTitle1', 'musicId1');
    expect(swapQueuePositions(-1, 0)).toStrictEqual(false);
  });

  test('returns false if positionB parameter is less than 0', () => {
    addSongRequest('musicTitle1', 'musicId1');
    expect(swapQueuePositions(0, -1)).toStrictEqual(false);
  });

  test('returns false if positionA and positionB paramter is less than 0', () => {
    addSongRequest('musicTitle1', 'musicId1');
    expect(swapQueuePositions(-1, -1)).toStrictEqual(false);
  });

  test('returns false if positionA does not refer to valid item in queue', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    expect(swapQueuePositions(2, 0)).toStrictEqual(false);
  });

  test('returns false if positionB does not refer to valid item in queue', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    expect(swapQueuePositions(0, 2)).toStrictEqual(false);
  });

  test('returns false if positionA and positionB does not refer to valid items in queue', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    expect(swapQueuePositions(2, 3)).toStrictEqual(false);    
  });

  test('swaps two elements in the queue', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    addSongRequest('musicTitle3', 'musicId3');
    expect(getMusicQueueItem(1)).toStrictEqual({
      'musicTitle': 'musicTitle2',
      'musicId': 'musicId2',
    });
    expect(getMusicQueueItem(2)).toStrictEqual({
      'musicTitle': 'musicTitle3',
      'musicId': 'musicId3',
    });
    expect(swapQueuePositions(1, 2)).toBe(true);
    expect(getMusicQueueItem(1)).toStrictEqual({
      'musicTitle': 'musicTitle3',
      'musicId': 'musicId3',
    });
    expect(getMusicQueueItem(2)).toStrictEqual({
      'musicTitle': 'musicTitle2',
      'musicId': 'musicId2',
    });
  });

  test('returns true if positionA = positionB', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    addSongRequest('musicTitle3', 'musicId3');
    expect(swapQueuePositions(1, 1)).toBe(true); 
  });
});

describe('clearQueue', () => {
  test('clears queue', () => {
    addSongRequest('musicTitle1', 'musicId1');
    addSongRequest('musicTitle2', 'musicId2');
    addSongRequest('musicTitle3', 'musicId3');
    expect(getMusicQueueLength()).not.toStrictEqual(0);
    clearQueue();
    expect(getMusicQueueLength()).toStrictEqual(0);        
  });
});