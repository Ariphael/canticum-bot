import { AudioPlayer } from "@discordjs/voice";
import { MusicQueueItemType } from "../../types/musicQueueItem";

export interface AudioResourceState {
  playAudio(audioPlayer: AudioPlayer): boolean,
  getCurrentPlayingSongInfo(): MusicQueueItemType | undefined,
  setCurrentPlayingSong(musicQueueItem: MusicQueueItemType): MusicQueueItemType,
  setAudioPlayerStatusIdleListener(audioPlayer: AudioPlayer): AudioPlayer | undefined,
  resourceSetVolume(volume: number): boolean
}