import ytdl from 'ytdl-core';
import { join } from 'path';
import { existsSync } from 'fs';
import { dequeue } from '../queue/songQueue';
import { 
  AudioPlayer, 
  AudioPlayerState, 
  AudioPlayerStatus, 
  AudioResource, 
  createAudioPlayer, 
  createAudioResource, 
  NoSubscriberBehavior 
} from '@discordjs/voice';
import { formatEmoji } from 'discord.js';
import { MusicQueueItemType } from '../types/types';

const audioPlayerComponents: { audioPlayer: AudioPlayer, audioResource: AudioResource } = {
  audioPlayer: null, 
  audioResource: null,
}

export const createNewAudioPlayer = (): AudioPlayer => {
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

export const playAudio = (): boolean => {
  audioPlayerComponents.audioPlayer.on(AudioPlayerStatus.Idle, () => {
    if (!doPlayAudio()) {
      stopAudioPlayer();
    }
  });
  return doPlayAudio();
};

export const isPlayingAudio = (): boolean => {
  return audioPlayerComponents.audioPlayer.checkPlayable();
}

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

const doPlayAudio = (): boolean => {
  const nextMusicQueueItem = dequeue();
  if (nextMusicQueueItem !== undefined) {
    audioPlayerComponents.audioResource = createAudioResource(
      ytdl(`https://www.youtube.com/watch?v=${nextMusicQueueItem.musicId}`, { filter: 'audioonly' })
    );
    audioPlayerComponents.audioPlayer.play(audioPlayerComponents.audioResource);
    return true;
  }
  return false;
}

