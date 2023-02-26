import { 
  AudioPlayer, 
  createAudioPlayer, 
  NoSubscriberBehavior, 
  PlayerSubscription, 
  VoiceConnection 
} from "@discordjs/voice";
import { AudioResourceState } from './AudioResourceState';
import { AudioResourceNormalState } from "./AudioResourceNormalState";
import { AudioResourceLoopCurrSongState } from "./AudioResourceLoopCurrSongState";
import { AudioResourceLoopQueueState } from "./AudioResourceLoopQueueState";

export { MusicPlayer };

class MusicPlayer {
  static musicPlayerSingletonInstance: MusicPlayer = null;
  private audioPlayer: AudioPlayer;

  private audioResourceNormalState: AudioResourceNormalState;
  private audioResourceLoopCurrSongState: AudioResourceLoopCurrSongState;
  private audioResourceLoopQueueState: AudioResourceLoopQueueState;
  private audioResourceState: AudioResourceState;

  constructor() {
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    this.audioResourceNormalState = new AudioResourceNormalState();
    this.audioResourceLoopCurrSongState = new AudioResourceLoopCurrSongState();
    this.audioResourceLoopQueueState = new AudioResourceLoopQueueState();
    this.audioResourceState = this.audioResourceNormalState;
  }

  public playAudio(): boolean {
    return this.audioResourceState.playAudio(this.audioPlayer);
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
    return this.audioResourceState.resourceSetVolume(volume);
  }

  public addAudioPlayerToVoiceConnectionSubscriptions(voiceConnection: VoiceConnection): PlayerSubscription {
    return voiceConnection.subscribe(this.audioPlayer);
  }

  public static getMusicPlayerInstance() {
    if (this.musicPlayerSingletonInstance === null) {
      return this.musicPlayerSingletonInstance = new MusicPlayer();
    }
    return this.musicPlayerSingletonInstance;
  }
}