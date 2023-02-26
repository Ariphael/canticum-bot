import { AudioPlayer } from "@discordjs/voice";
import { AudioResourceLoopCurrSongState } from "./AudioResourceLoopCurrSongState";
import { AudioResourceLoopQueueState } from "./AudioResourceLoopQueueState";
import { AudioResourceNormalState } from "./AudioResourceNormalState";
import { AudioResourceState } from "./AudioResourceState";

export { AudioResourceManager };

class AudioResourceManager {
  private audioResourceNormalState: AudioResourceNormalState;
  private audioResourceLoopCurrSongState: AudioResourceLoopCurrSongState;
  private audioResourceLoopQueueState: AudioResourceLoopQueueState;
  private audioResourceState: AudioResourceState;

  constructor() {
    this.audioResourceNormalState = new AudioResourceNormalState();
    this.audioResourceLoopCurrSongState = new AudioResourceLoopCurrSongState();
    this.audioResourceLoopQueueState = new AudioResourceLoopQueueState();
    this.audioResourceState = this.audioResourceNormalState;
  }

  public playAudio(audioPlayer: AudioPlayer): boolean {
    return this.audioResourceState.playAudio(audioPlayer);
  }

  public resourceSetVolume(volume: number): boolean {
    return this.audioResourceState.resourceSetVolume(volume);
  }

  public switchToLoopCurrSongState() {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    this.audioResourceLoopCurrSongState.setCurrentPlayingSong(currentPlayingSongInfo);
    this.audioResourceState = this.audioResourceLoopCurrSongState;
  }

  public switchToLoopQueueState() {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    this.audioResourceLoopQueueState.setCurrentPlayingSong(currentPlayingSongInfo);
    this.audioResourceState = this.audioResourceLoopQueueState;
  }

  public switchToNormalState() {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    this.audioResourceNormalState.setCurrentPlayingSong(currentPlayingSongInfo);
    this.audioResourceState = this.audioResourceNormalState;    
  }
}