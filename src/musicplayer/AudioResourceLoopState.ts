import { MusicQueueItemType } from "../types/musicQueueItem";
import { AudioResourceState } from "./AudioResourceState";

export interface AudioResourceLoopState extends AudioResourceState {
  setCurrentPlayingSong(musicQueueItem: MusicQueueItemType): MusicQueueItemType,
}