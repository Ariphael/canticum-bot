import { AudioResource, AudioPlayer, AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";
import { getMusicQueueIterator, getMusicQueueLength } from "../../queue/songQueue";
import { MusicQueueItemType } from "../../types/musicQueueItem";
import { AudioResourceState } from "./AudioResourceState";

export { AudioResourceLoopQueueState };

class AudioResourceLoopQueueState implements AudioResourceState {
  private audioResource: AudioResource = undefined;
  private currentPlayingMusicQueueItem: MusicQueueItemType = undefined;
  private musicQueueIterator = getMusicQueueIterator();

  public playAudio(audioPlayer: AudioPlayer): boolean {
    return this.doPlayAudio(audioPlayer);
  };

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

  private doPlayAudio(audioPlayer: AudioPlayer): boolean {
    if (getMusicQueueLength() === 0) return false;

    if (this.currentPlayingMusicQueueItem === null) {
      let nextMusicQueueItem = this.musicQueueIterator.next();
      if (nextMusicQueueItem.done) {
        this.musicQueueIterator = getMusicQueueIterator();
        nextMusicQueueItem = this.musicQueueIterator.next();
      }
      this.currentPlayingMusicQueueItem = nextMusicQueueItem.value;
    }
    
    const audioStream = 
      ytdl(`https://www.youtube.com/watch?v=${this.currentPlayingMusicQueueItem.musicId}`, {
        filter: 'audioonly',
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        quality: 'lowestaudio',
      });
    
    this.audioResource = createAudioResource(audioStream, {
      inlineVolume: true,
    });
    
    try {
      audioPlayer.play(this.audioResource);
      return true;
    } catch (error) {
      return false;
    }
  }
}