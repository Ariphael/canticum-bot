import { 
  AudioPlayer, 
  createAudioPlayer, 
  NoSubscriberBehavior, 
  PlayerSubscription, 
  VoiceConnection 
} from "@discordjs/voice";
import { AudioResourceManager } from "./audioresource/AudioResourceManager";

export { MusicPlayer };

class MusicPlayer {
  static musicPlayerSingletonInstance: MusicPlayer = null;
  private audioPlayer: AudioPlayer;
  private audioResourceManager: AudioResourceManager;

  constructor() {
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    this.audioResourceManager = new AudioResourceManager();
  }

  public playAudio(): boolean {
    return this.audioResourceManager.playAudio(this.audioPlayer);
  }
  
  public stopAudioPlayer(): boolean {
    return this.audioPlayer.stop();
  }

  public isPlayingAudio(): boolean {
    return this.audioPlayer.checkPlayable();
  }

  public pauseAudio(): boolean {
    return this.audioPlayer.pause();
  }

  public unpauseAudio(): boolean {
    return this.audioPlayer.unpause();
  }

  public setVolume(volume: number): boolean {
    return this.audioResourceManager.resourceSetVolume(volume);
  }

  public addAudioPlayerToVoiceConnectionSubscriptions(voiceConnection: VoiceConnection): PlayerSubscription {
    return voiceConnection.subscribe(this.audioPlayer);
  }

  public switchToLoopCurrSongState() {
    this.audioResourceManager.switchToLoopCurrSongState();
  }

  public switchToLoopQueueState() {
    this.audioResourceManager.switchToLoopQueueState();
  }

  public switchToNormalState() {
    this.audioResourceManager.switchToNormalState();
  }

  public static getMusicPlayerInstance() {
    if (this.musicPlayerSingletonInstance === null) {
      return this.musicPlayerSingletonInstance = new MusicPlayer();
    }
    return this.musicPlayerSingletonInstance;
  }
}