import { 
  AudioPlayer, 
  AudioResource, 
  createAudioPlayer, 
  createAudioResource, 
  NoSubscriberBehavior 
} from '@discordjs/voice';
import { join } from 'path';
import { existsSync } from 'fs';

const audioPlayerComponents: { audioPlayer: AudioPlayer, audioResource: AudioResource } = {
  audioPlayer: null, 
  audioResource: null,
}

export const createAudioPlayerResource = (): AudioPlayer => {
  return audioPlayerComponents.audioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
};

export const stopAudioPlayer = (): boolean => {
  const audioPlayer = audioPlayerComponents.audioPlayer;
  return audioPlayer !== null ? audioPlayer.stop() : false;
};

export const playAudio = (audioId: string): boolean => {
  if (
    audioPlayerComponents.audioPlayer.playable.length === 0 
    || audioId === '' 
    || existsSync(join(__dirname, `/../../music_downloads/${audioId}.mp4`))
  ) {
    return false;
  }

  audioPlayerComponents.audioResource = createAudioResource(
    join(__dirname, `/../../music_downloads/${audioId}.mp4`)
  );
  audioPlayerComponents.audioPlayer.play(audioPlayerComponents.audioResource);
  return true;
};

export const resourceSetVolume = (volume: number): boolean => {
  if (volume < 0 || audioPlayerComponents.audioResource === null) {
    return false;
  }
  audioPlayerComponents.audioResource.volume.setVolume(volume);
  return true;
}

export const pauseAudio = (): boolean => {
  return audioPlayerComponents.audioPlayer.pause();
};

export const unpauseAudio = (): boolean => {
  return audioPlayerComponents.audioPlayer.unpause();
}

export const getAudioPlayer = (): AudioPlayer => {
  return audioPlayerComponents.audioPlayer;
};

export const getAudioPlayerSubscribers = () => {
  return audioPlayerComponents.audioPlayer.playable;
}

