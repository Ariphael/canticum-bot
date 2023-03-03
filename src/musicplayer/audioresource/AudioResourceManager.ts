import { AudioPlayer } from "@discordjs/voice";
import { MusicQueueItemType } from "../../types/musicQueueItem";
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
    return this.audioResourceState.setAudioPlayerStatusIdleListener(audioPlayer) 
      && this.audioResourceState.playAudio(audioPlayer);
  }

  public resourceSetVolume(volume: number): boolean {
    return this.audioResourceState.resourceSetVolume(volume);
  }

  public clearCachedMusicQueueItem() {
    this.audioResourceState.setCurrentPlayingSong(null);
  }

  public getCurrentPlayingSongInfo(): MusicQueueItemType {
    return this.audioResourceState.getCurrentPlayingSongInfo();
  }

  public isLoopingOn(): boolean {
    return this.audioResourceState instanceof AudioResourceLoopQueueState
      || this.audioResourceState instanceof AudioResourceLoopCurrSongState;
  }

  public switchToLoopCurrSongState(audioPlayer: AudioPlayer) {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    this.audioResourceLoopCurrSongState.setCurrentPlayingSong(currentPlayingSongInfo);
    this.audioResourceState.setCurrentPlayingSong(null);
    this.audioResourceState = this.audioResourceLoopCurrSongState;
    this.audioResourceState.setAudioPlayerStatusIdleListener(audioPlayer);
  }

  public switchToLoopQueueState(audioPlayer: AudioPlayer) {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    this.audioResourceLoopQueueState.setCurrentPlayingSong(currentPlayingSongInfo);
    this.audioResourceState.setCurrentPlayingSong(null);
    this.audioResourceState = this.audioResourceLoopQueueState;
    this.audioResourceState.setAudioPlayerStatusIdleListener(audioPlayer);
  }

  public switchToNormalState(audioPlayer: AudioPlayer) {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    this.audioResourceNormalState.setCurrentPlayingSong(currentPlayingSongInfo);
    this.audioResourceState.setCurrentPlayingSong(null);
    this.audioResourceState = this.audioResourceNormalState;    
    this.audioResourceState.setAudioPlayerStatusIdleListener(audioPlayer);
  }
}