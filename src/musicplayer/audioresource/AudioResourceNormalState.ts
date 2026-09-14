import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  AudioResource, 
  createAudioResource 
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { musicQueue } from '../../queue/musicQueue';
import { AudioResourceState } from './AudioResourceState';
import { MusicQueueItemType } from '../../types/musicQueueItem';

export { AudioResourceNormalState };

class AudioResourceNormalState implements AudioResourceState {
  private audioResource: AudioResource | undefined;
  private currentPlayingMusicQueueItem: MusicQueueItemType | undefined;
  private resourceVolume: number;

  constructor() {
    this.audioResource = undefined;
    this.currentPlayingMusicQueueItem = undefined;
    this.resourceVolume = 0.5;
  }

  public async playAudio(audioPlayer: AudioPlayer): Promise<boolean> {
    return await this.doPlayAudio(audioPlayer);
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
      if (!this.doPlayAudio(audioPlayer)) 
        audioPlayer.stop();
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

  private async doPlayAudio(audioPlayer: AudioPlayer) {
    const nextMusicQueueItem = this.currentPlayingMusicQueueItem === undefined
      ? await musicQueue.dequeue()
      : this.currentPlayingMusicQueueItem;

    if (nextMusicQueueItem !== undefined) {
      this.audioResource = createAudioResource(
        ytdl(`https://www.youtube.com/watch?v=${nextMusicQueueItem.musicId}`, { 
          filter: 'audioonly',
          highWaterMark: 1 << 62,
          liveBuffer: 1 << 62,
          dlChunkSize: 0,
          quality: "lowestaudio",
        }), {
          inlineVolume: true,
        }
      );
      this.audioResource.volume!.setVolume(this.resourceVolume);
      audioPlayer.play(this.audioResource);
      this.currentPlayingMusicQueueItem = nextMusicQueueItem;
      return true;
    }
    return false;
  }

}