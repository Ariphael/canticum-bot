type MusicQueueItemType = {musicTitle: String, musicLink: String};
const musicQueue: MusicQueueItemType[] = [];

export const addSongRequest = (musicTitle: String, musicLink: String): number => {
  return musicQueue.push({
    musicTitle: musicTitle,
    musicLink: musicLink,
  });
}

export const dequeue = (): {musicTitle: String, musicLink: String} => {
  return musicQueue.shift();
}

export const swapQueuePositions = (positionA: number, positionB: number): MusicQueueItemType[] => {
  if (positionA < 0 || positionB < 0) {
    console.log("Error: swapQueuePositions called with positionA < 0 or positionB < 0");
    return null;
  }
  const tempMusicQueueValue = musicQueue[positionA];
  musicQueue[positionA] = musicQueue[positionB];
  musicQueue[positionB] = tempMusicQueueValue;
  return musicQueue;
}

export const getMusicQueue = (): MusicQueueItemType[] => {
  return musicQueue;
}

export const clearQueue = (): MusicQueueItemType[] => {
  musicQueue.length = 0;
  return musicQueue;
}