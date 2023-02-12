import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  AudioResource, 
  createAudioResource 
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { dequeue } from '../queue/songQueue';
import { AudioResourceState } from './AudioResourceState';

export { AudioResourceNormalState };

class AudioResourceNormalState implements AudioResourceState {
  private audioResource: AudioResource = null;

  public playAudio(audioPlayer: AudioPlayer): boolean {
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      if (!this.doPlayAudio(audioPlayer)) {
        audioPlayer.stop();
      }
    });
    return this.doPlayAudio(audioPlayer);
  }

  public resourceSetVolume(volume: number): boolean {
    if (volume < 0 || this.audioResource === null) {
      return false;
    }
    this.audioResource.volume.setVolume(volume);
    return true;
  }

  private doPlayAudio(audioPlayer: AudioPlayer) {
    const nextMusicQueueItem = dequeue();
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
      return true;
    }
    return false;
  }

}