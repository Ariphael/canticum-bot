import { AudioPlayer, AudioResource } from "@discordjs/voice";
import { MusicQueueItemType } from "../types/musicQueueItem";

export interface AudioResourceState {
  playAudio(audioPlayer: AudioPlayer): boolean,
  getCurrentPlayingSongInfo(): MusicQueueItemType,
  resourceSetVolume(volume: number): boolean
}