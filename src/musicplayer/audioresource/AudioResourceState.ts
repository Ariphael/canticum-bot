import { AudioPlayer } from "@discordjs/voice";
import { MusicQueueItemType } from "../../types/musicQueueItem";

export interface AudioResourceState {
  playAudio(audioPlayer: AudioPlayer): Promise<boolean>,
  getCurrentPlayingSongInfo(): MusicQueueItemType | undefined,
  setCurrentPlayingSong(musicQueueItem: MusicQueueItemType | undefined): MusicQueueItemType | undefined,
  setAudioPlayerStatusIdleListener(audioPlayer: AudioPlayer): AudioPlayer | undefined,
  resourceSetVolume(volume: number): boolean,
  getResourceVolume(): number
}