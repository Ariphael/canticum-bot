import { AudioPlayer, AudioResource } from "@discordjs/voice";

export interface AudioResourceState {
  playAudio(audioPlayer: AudioPlayer): boolean,
  resourceSetVolume(volume: number): boolean
}