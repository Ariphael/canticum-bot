import { MusicQueueItemType } from "../types/musicQueueItem";
import * as db from "../utils/database";

const queue: MusicQueueItemType[] = [];

export const musicQueue = {
  enqueue: async (musicQueueItem: MusicQueueItemType, memberId: string): Promise<number> => {
    await db.query(
      `INSERT INTO enqueueHistory (title, uploader, originalURL, userId, enqueueTimestamp) VALUES (?, ?, ?, ?, ?)`,
      [musicQueueItem.musicTitle, musicQueueItem.uploader, musicQueueItem.originalURL, memberId, 'NOW()']);
    return queue.push(musicQueueItem);
  },
  dequeue: (): MusicQueueItemType | undefined => {
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
      : queue.splice(queuePosA - 1, queuePosB - queuePosA + 1);
  },
  shuffle: (): MusicQueueItemType[] => {
    for (let i = queue.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      const oldElement = queue[i];
      queue[i] = queue[rand];
      queue[rand] = oldElement;
    }
    return queue;
  }, 
  getIterator: () => {
    return queue.values();
  },
  getQueueSliceIterator: (start: number, end: number) => {
    return queue
      .slice(start, end)
      .values();
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
