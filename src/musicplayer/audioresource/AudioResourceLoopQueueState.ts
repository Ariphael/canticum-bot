import { AudioResource, AudioPlayer, AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";
import { musicQueue } from "../../queue/musicQueue";
import { MusicQueueItemType } from "../../types/musicQueueItem";
import { AudioResourceState } from "./AudioResourceState";

export { AudioResourceLoopQueueState };

class AudioResourceLoopQueueState implements AudioResourceState {
  private audioResource: AudioResource | undefined;
  private currentPlayingMusicQueueItem: MusicQueueItemType | undefined;
  private musicQueueIterator: IterableIterator<MusicQueueItemType>;
  private resourceVolume: number;

  constructor() {
    this.audioResource = undefined;
    this.currentPlayingMusicQueueItem = undefined;
    this.musicQueueIterator = musicQueue.getIterator();
    this.resourceVolume = 0.5;
  }

  public async playAudio(audioPlayer: AudioPlayer): Promise<boolean> {
    return this.doPlayAudio(audioPlayer);
  }

  public getCurrentPlayingSongInfo(): MusicQueueItemType | undefined {
    return this.currentPlayingMusicQueueItem;
  }

  public setCurrentPlayingSong(musicQueueItem: MusicQueueItemType | undefined): MusicQueueItemType | undefined {
    return this.currentPlayingMusicQueueItem = musicQueueItem;
  }

  public setAudioPlayerStatusIdleListener(audioPlayer: AudioPlayer): AudioPlayer | undefined {
    if (audioPlayer.listenerCount(AudioPlayerStatus.Idle) >= 1) return undefined;
    return audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.currentPlayingMusicQueueItem = undefined;
      if (!this.doPlayAudio(audioPlayer)) audioPlayer.stop();
    });  
  }

  public resourceSetVolume(volume: number): boolean {
    if (volume < 0 || this.audioResource === undefined) {
      return false;
    }
    this.resourceVolume = volume;
    this.audioResource.volume!.setVolume(volume);
    return true;
  }

  public getResourceVolume(): number {
    return this.resourceVolume;
  }

  private doPlayAudio(audioPlayer: AudioPlayer): boolean {
    if (musicQueue.getLength() === 0) return false;

    if (this.currentPlayingMusicQueueItem === undefined) {
      let nextMusicQueueItem = this.musicQueueIterator.next();
      if (nextMusicQueueItem.done) {
        this.musicQueueIterator = musicQueue.getIterator();
        nextMusicQueueItem = this.musicQueueIterator.next();
      }
      this.currentPlayingMusicQueueItem = nextMusicQueueItem.value;
    }

    const audioStream = 
      ytdl(`https://www.youtube.com/watch?v=${this.currentPlayingMusicQueueItem!.musicId}`, {
        filter: 'audioonly',
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        quality: 'lowestaudio',
      });
    
    this.audioResource = createAudioResource(audioStream, {
      inlineVolume: true,
    });

    this.audioResource.volume!.setVolume(this.resourceVolume);
    
    try {
      audioPlayer.play(this.audioResource);
      return true;
    } catch (error) {
      return false;
    }
  }
}