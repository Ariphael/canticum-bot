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

  public async playAudio(audioPlayer: AudioPlayer): Promise<boolean> {
    this.audioResourceState.setAudioPlayerStatusIdleListener(audioPlayer);
    return this.audioResourceState.playAudio(audioPlayer);
  }

  public resourceSetVolume(volume: number): boolean {
    return this.audioResourceState.resourceSetVolume(volume);
  }

  public clearCachedMusicQueueItem() {
    this.audioResourceState.setCurrentPlayingSong(undefined);
  }

  public getCurrentPlayingSongInfo(): MusicQueueItemType | undefined {
    return this.audioResourceState.getCurrentPlayingSongInfo();
  }

  public isLoopingOn(): boolean {
    return this.audioResourceState instanceof AudioResourceLoopQueueState
      || this.audioResourceState instanceof AudioResourceLoopCurrSongState;
  }

  public switchToLoopCurrSongState(audioPlayer: AudioPlayer) {
    this.transferCurrAudioResourceStateStateTo(this.audioResourceLoopCurrSongState);
    this.setCurrAudioResourceStateTo(this.audioResourceLoopCurrSongState, audioPlayer);
  }

  public switchToLoopQueueState(audioPlayer: AudioPlayer) {
    this.transferCurrAudioResourceStateStateTo(this.audioResourceLoopQueueState);
    this.setCurrAudioResourceStateTo(this.audioResourceLoopQueueState, audioPlayer);
  }

  public switchToNormalState(audioPlayer: AudioPlayer) {
    this.transferCurrAudioResourceStateStateTo(this.audioResourceNormalState);
    this.setCurrAudioResourceStateTo(this.audioResourceNormalState, audioPlayer);
  }

  private transferCurrAudioResourceStateStateTo(to: AudioResourceState) {
    const currentPlayingSongInfo = this.audioResourceState.getCurrentPlayingSongInfo();
    const currentAudioResourceVolume = this.audioResourceState.getResourceVolume();
    to.setCurrentPlayingSong(currentPlayingSongInfo);
    to.resourceSetVolume(currentAudioResourceVolume);   
  }

  private setCurrAudioResourceStateTo(to: AudioResourceState, audioPlayer: AudioPlayer) {
    this.audioResourceState.setCurrentPlayingSong(undefined);
    this.audioResourceState = to;  
    audioPlayer.removeAllListeners();
    this.audioResourceState.setAudioPlayerStatusIdleListener(audioPlayer);    
  }
}