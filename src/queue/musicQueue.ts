import { MusicQueueItemType } from "../types/musicQueueItem";

const queue: MusicQueueItemType[] = [];

export const musicQueue = {
  enqueue: (musicQueueItem: MusicQueueItemType): number => {
    return queue.push(musicQueueItem);
  },
  dequeue: (): MusicQueueItemType => {
    return queue.shift();
  },
  swapQueuePositions: (positionA: number, positionB: number): boolean => {
    if (positionA <= 0 || positionB <= 0) {
      return false;
    } else if (
      queue.at(positionA - 1) === undefined 
      || queue.at(positionB - 1) === undefined
    ) {
      return false;
    }
  
    const tempMusicQueueValue = queue[positionA - 1];
    queue[positionA - 1] = queue[positionB - 1];
    queue[positionB - 1] = tempMusicQueueValue;
    return true;    
  },
  removeQueueItem: (queuePos: number): MusicQueueItemType | undefined => {
    const deletedItemsArr = queue.splice(queuePos - 1, 1);
    return deletedItemsArr.length === 0 ? undefined : deletedItemsArr[0];
  },
  removeQueueItemsRange: (queuePosA: number, queuePosB: number): MusicQueueItemType[] | undefined => {
    return queuePosA > queuePosB || queuePosA <= 0 || queuePosB <= 0 
      ? undefined
      : queue.splice(queuePosA - 1, queuePosB - 1 - queuePosA + 2);
  },
  getIterator: () => {
    return queue.values();
  },
  getItem: (index: number) => {
    if (index <= 0) return undefined;
    return queue.at(index - 1);
  },
  getLength: (): number => {
    return queue.length;
  },
  clear: (): MusicQueueItemType[] => {
    queue.length = 0;
    return queue;
  },
};

// export const addSongRequest = (musicTitle: String, musicId: String): number => {
//   return musicQueue.push({
//     musicTitle: musicTitle,
//     musicId: musicId,
//   });
// }

// export const dequeue = (): {musicTitle: String, musicId: String} | undefined => {
//   return musicQueue.shift();
// }

// export const swapQueuePositions = (positionA: number, positionB: number): boolean => {
//   if (positionA <= 0 || positionB <= 0) {
//     return false;
//   } else if (musicQueue.at(positionA - 1) === undefined || musicQueue.at(positionB - 1) === undefined) {
//     return false;
//   }

//   const tempMusicQueueValue = musicQueue[positionA - 1];
//   musicQueue[positionA - 1] = musicQueue[positionB - 1];
//   musicQueue[positionB - 1] = tempMusicQueueValue;
//   return true;
// }

// export const removeQueueItem = (queuePos: number): MusicQueueItemType | undefined => {
//   const deletedItemsArr = musicQueue.splice(queuePos - 1, 1);
//   return deletedItemsArr.length === 0 ? undefined : deletedItemsArr[0];
// };

// export const removeQueueItemsRange = (queuePosA: number, queuePosB: number): MusicQueueItemType[] | undefined => {
//   return queuePosA > queuePosB || queuePosA <= 0 || queuePosB <= 0 
//     ? undefined
//     : musicQueue.splice(queuePosA - 1, queuePosB - 1 - queuePosA + 2);
// }

// export const getMusicQueueIterator = () => {
//   return musicQueue.values();
// }

// export const getMusicQueueItem = (index: number) => {
//   if (index <= 0) return undefined;
//   return musicQueue.at(index - 1);
// }

// export const getMusicQueueLength = (): number => {
//   return musicQueue.length;
// }

// export const clearQueue = (): MusicQueueItemType[] => {
//   musicQueue.length = 0;
//   return musicQueue;
// }