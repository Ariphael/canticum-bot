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
  private audioResource: AudioResource = undefined;
  private currentPlayingMusicQueueItem: MusicQueueItemType = undefined;

  public playAudio(audioPlayer: AudioPlayer): boolean {
    return this.doPlayAudio(audioPlayer);
  }

  public getCurrentPlayingSongInfo(): MusicQueueItemType | undefined {
    return this.currentPlayingMusicQueueItem;
  }

  public setCurrentPlayingSong(musicQueueItem: MusicQueueItemType): MusicQueueItemType {
    return this.currentPlayingMusicQueueItem = musicQueueItem;
  }

  public setAudioPlayerStatusIdleListener(audioPlayer: AudioPlayer): AudioPlayer | undefined {
    if (audioPlayer.listenerCount(AudioPlayerStatus.Idle) >= 1) return undefined;
    return audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.currentPlayingMusicQueueItem = null;
      if (!this.doPlayAudio(audioPlayer)) audioPlayer.stop();
    });  
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