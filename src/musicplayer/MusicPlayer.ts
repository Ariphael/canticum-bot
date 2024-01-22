import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  createAudioPlayer, 
  NoSubscriberBehavior, 
  PlayerSubscription, 
  VoiceConnection 
} from "@discordjs/voice";
import { MusicQueueItemType } from "../types/musicQueueItem";
import { AudioResourceManager } from "./audioresource/AudioResourceManager";

export { MusicPlayer };

class MusicPlayer {
  static musicPlayerSingletonInstance: MusicPlayer | undefined = undefined;
  private audioPlayer: AudioPlayer;
  private audioResourceManager: AudioResourceManager;
  private paused: boolean;

  constructor() {
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    this.audioResourceManager = new AudioResourceManager();
    this.paused = false;
  }

  public async playAudio(): Promise<boolean> {
    return await this.audioResourceManager.playAudio(this.audioPlayer);
  }

  public stopAudioPlayer(): boolean {
    this.audioResourceManager.clearCachedMusicQueueItem();
    return this.audioPlayer.stop();
  }

  public isPlayingAudio(): boolean {
    return !this.paused && this.audioPlayer.checkPlayable();
  }

  public isAudioResourcePlayable(): boolean {
    return this.audioPlayer.checkPlayable();
  }

  public pauseAudio(): boolean {
    this.paused = false;
    return this.audioPlayer.pause();
  }

  public unpauseAudio(): boolean {
    this.paused = true;
    return this.audioPlayer.unpause();
  }

  public setVolume(volume: number): boolean {
    return this.audioResourceManager.resourceSetVolume(volume);
  }

  public addAudioPlayerToVoiceConnectionSubscriptions(voiceConnection: VoiceConnection): PlayerSubscription | undefined {
    return voiceConnection.subscribe(this.audioPlayer);
  }

  public getCurrentPlayingSongInfo(): MusicQueueItemType | undefined {
    return this.audioResourceManager.getCurrentPlayingSongInfo();
  }

  public isLoopingOn(): boolean {
    return this.audioResourceManager.isLoopingOn();
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public switchToLoopCurrSongState() {
    this.audioPlayer.removeAllListeners(AudioPlayerStatus.Idle);
    this.audioResourceManager.switchToLoopCurrSongState(this.audioPlayer);
  }

  public switchToLoopQueueState() {
    this.audioPlayer.removeAllListeners(AudioPlayerStatus.Idle);
    this.audioResourceManager.switchToLoopQueueState(this.audioPlayer);
  }

  public switchToNormalState() {
    this.audioPlayer.removeAllListeners(AudioPlayerStatus.Idle);
    this.audioResourceManager.switchToNormalState(this.audioPlayer);
  }

  public static getMusicPlayerInstance() {
    if (this.musicPlayerSingletonInstance === undefined) {
      return this.musicPlayerSingletonInstance = new MusicPlayer();
    }
    return this.musicPlayerSingletonInstance;
  }
}