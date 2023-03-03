import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  AudioResource, 
  createAudioResource 
} from "@discordjs/voice";
import ytdl from "ytdl-core";
import { dequeue } from "../../queue/songQueue";
import { MusicQueueItemType } from "../../types/musicQueueItem";
import { AudioResourceState } from "./AudioResourceState";

export { AudioResourceLoopCurrSongState };

class AudioResourceLoopCurrSongState implements AudioResourceState {
  private audioResource: AudioResource = undefined;
  private currentPlayingMusicQueueItem: MusicQueueItemType = undefined;

  public playAudio(audioPlayer: AudioPlayer): boolean {
    return this.doPlayAudio(audioPlayer);
  };

  public resourceSetVolume(volume: number): boolean {
    if (volume < 0 || this.audioResource === null) {
      return false;
    }
    this.audioResource.volume.setVolume(volume);
    return true;
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
      if (!this.doPlayAudio(audioPlayer)) audioPlayer.stop();
    });  
  }

  private doPlayAudio(audioPlayer: AudioPlayer): boolean {
    const nextMusicQueueItem = this.currentPlayingMusicQueueItem === null
      ? this.currentPlayingMusicQueueItem = dequeue()
      : this.currentPlayingMusicQueueItem;
      
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
    
    try {
      audioPlayer.play(this.audioResource);
    } catch (error) {
      return false;
    }
    return true;
  }
};