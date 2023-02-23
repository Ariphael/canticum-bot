type MusicQueueItemType = { musicTitle: String, musicId: String };

const musicQueue: MusicQueueItemType[] = [];

export const addSongRequest = (musicTitle: String, musicId: String): number => {
  return musicQueue.push({
    musicTitle: musicTitle,
    musicId: musicId,
  });
}

export const dequeue = (): {musicTitle: String, musicId: String} | undefined => {
  return musicQueue.shift();
}

export const swapQueuePositions = (positionA: number, positionB: number): boolean => {
  if (positionA < 0 || positionB < 0) {
    return false;
  } else if (musicQueue.at(positionA) === undefined || musicQueue.at(positionB) === undefined) {
    return false;
  }

  const tempMusicQueueValue = musicQueue[positionA];
  musicQueue[positionA] = musicQueue[positionB];
  musicQueue[positionB] = tempMusicQueueValue;
  return true;
}

export const getMusicQueueIterator = () => {
  return musicQueue.values();
}

export const getMusicQueueItem = (index: number) => {
  return musicQueue.at(index);
}

export const getMusicQueueLength = (): number => {
  return musicQueue.length;
}

export const clearQueue = (): MusicQueueItemType[] => {
  musicQueue.length = 0;
  return musicQueue;
}