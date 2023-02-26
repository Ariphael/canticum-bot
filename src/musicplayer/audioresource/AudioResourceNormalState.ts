import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  AudioResource, 
  createAudioResource 
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { dequeue } from '../../queue/songQueue';
import { AudioResourceState } from './AudioResourceState';
import { MusicQueueItemType } from '../../types/musicQueueItem';

export { AudioResourceNormalState };

class AudioResourceNormalState implements AudioResourceState {
  private audioResource: AudioResource = null;
  private currentPlayingMusicQueueItem: MusicQueueItemType = null;

  public playAudio(audioPlayer: AudioPlayer): boolean {
    if (audioPlayer.listenerCount(AudioPlayerStatus.Idle) < 1) {
      audioPlayer.on(AudioPlayerStatus.Idle, () => {
        this.currentPlayingMusicQueueItem = null;
        if (!this.doPlayAudio(audioPlayer)) audioPlayer.stop();
      });
    }
    
    return this.doPlayAudio(audioPlayer);
  }

  public getCurrentPlayingSongInfo(): MusicQueueItemType {
    return this.currentPlayingMusicQueueItem;
  }

  public setCurrentPlayingSong(musicQueueItem: MusicQueueItemType): MusicQueueItemType {
    return this.currentPlayingMusicQueueItem = musicQueueItem;
  }

  public resourceSetVolume(volume: number): boolean {
    if (volume < 0 || this.audioResource === null) {
      return false;
    }
    this.audioResource.volume.setVolume(volume);
    return true;
  }

  private doPlayAudio(audioPlayer: AudioPlayer) {
    const nextMusicQueueItem = this.currentPlayingMusicQueueItem === null
      ? dequeue()
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
      audioPlayer.play(this.audioResource);
      this.currentPlayingMusicQueueItem = nextMusicQueueItem;
      return true;
    }
    return false;
  }

}