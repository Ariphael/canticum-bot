import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { AudioResourceNormalState } from '../musicplayer/AudioResourceNormalState';
import { AudioPlayer, AudioResource, createAudioPlayer, NoSubscriberBehavior, PlayerSubscription, VoiceConnection } from '@discordjs/voice';
import { addSongRequest, clearQueue } from '../queue/musicQueue';
import ytdl from 'ytdl-core';

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
  };
});

beforeEach(() => {
  jest.restoreAllMocks();
  clearQueue();
  MusicPlayer.getMusicPlayerInstance().stopAudioPlayer();
});

afterEach(() => {
  jest.restoreAllMocks();
  clearQueue();
  MusicPlayer.getMusicPlayerInstance().stopAudioPlayer();
});

describe('MusicPlayer', () => {
  test('getMusicPlayerInstance returns instance of MusicPlayer', () => {
    expect(MusicPlayer.getMusicPlayerInstance()).toBeInstanceOf(MusicPlayer);
  });

  test('getMusicPlayerInstance does not create another instance of MusicPlayer', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(MusicPlayer.getMusicPlayerInstance() === musicPlayerInstance).toBe(true);
  });

  test('setVolume forwards audio resource resourceSetVolume method and returns corresponding boolean value', () => {
    const resourceSetVolumeSpy = jest.spyOn(AudioResourceNormalState.prototype, 'resourceSetVolume');
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    const newVolumeLevel = -1;
    expect(musicPlayerInstance.setVolume(newVolumeLevel)).toEqual(expect.any(Boolean));
    expect(resourceSetVolumeSpy).toHaveBeenCalledTimes(1);
    expect(resourceSetVolumeSpy).toHaveBeenCalledWith(newVolumeLevel);
  });

  test('setVolume returns false if volume < 0 and resource does not exist', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.setVolume(-1)).toEqual(false);
  });

  test('setVolume returns false if volume >= 0 and resource does not exist', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.setVolume(0)).toEqual(false);
    expect(musicPlayerInstance.setVolume(1)).toEqual(false);
  });

  test('setVolume returns false if volume < 0 and resource exists', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    addSongRequest('musicTitle1', 'RIGfQZ3vPtk');
    expect(musicPlayerInstance.playAudio()).toBe(true);
    expect(musicPlayerInstance.setVolume(-1)).toEqual(false);
  });

  test('setVolume returns true if volume >= 0 and resource exists', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    addSongRequest('musicTitle1', 'RIGfQZ3vPtk');
    expect(musicPlayerInstance.playAudio()).toBe(true);
    expect(musicPlayerInstance.setVolume(0)).toEqual(true); 
    expect(musicPlayerInstance.setVolume(0.5)).toEqual(true);    
    expect(musicPlayerInstance.setVolume(1)).toEqual(true); 
  });

  test('playAudio calls the audio resource playAudio function and returns boolean value (AudioResourceNormalState)', () => {
    const playAudioSpy = jest.spyOn(AudioResourceNormalState.prototype, 'playAudio');
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.playAudio()).toEqual(expect.any(Boolean));
    expect(playAudioSpy).toHaveBeenCalledTimes(1);
    expect(playAudioSpy).toHaveBeenCalledWith(expect.any(AudioPlayer));
  });

  test('playAudio returns false if song queue is empty', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.playAudio()).toBe(false);
  });

  test('playAudio returns true if there exists entries in the song queue', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    addSongRequest('musicTitle1', 'RIGfQZ3vPtk');
    expect(musicPlayerInstance.playAudio()).toBe(true);
  })

  test('stopAudioPlayer forwards AudioPlayer stop method and returns corresponding boolean value', () => {
    const audioPlayerStopSpy = jest.spyOn(AudioPlayer.prototype, 'stop');
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.stopAudioPlayer()).toEqual(expect.any(Boolean));
    expect(audioPlayerStopSpy).toHaveBeenCalledTimes(1);
    expect(audioPlayerStopSpy).toHaveBeenCalledWith();    
  });

  test('isPlayingAudio forwards AudioPlayer checkPlayable method and returns corresponding boolean value', () => {
    const audioPlayerCheckPlayableSpy = jest.spyOn(AudioPlayer.prototype, 'checkPlayable');
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.isPlayingAudio()).toEqual(expect.any(Boolean));
    expect(audioPlayerCheckPlayableSpy).toHaveBeenCalledTimes(1);
    expect(audioPlayerCheckPlayableSpy).toHaveBeenCalledWith();        
  });

  test('isPlayingAudio returns false if resource does not exist', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.isPlayingAudio()).toEqual(false);
  });

  test('isPlayingAudio returns true if resource exists', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    addSongRequest('musicTitle1', 'RIGfQZ3vPtk');
    expect(musicPlayerInstance.playAudio()).toBe(true);
    expect(musicPlayerInstance.isPlayingAudio()).toEqual(false);
  });

  test('pauseAudio forwards AudioPlayer pause method and returns corresponding boolean value', () => {
    const audioPlayerPauseSpy = jest.spyOn(AudioPlayer.prototype, 'pause');
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.pauseAudio()).toEqual(expect.any(Boolean));
    expect(audioPlayerPauseSpy).toHaveBeenCalledTimes(1);
    expect(audioPlayerPauseSpy).toHaveBeenCalledWith();          
  });

  test('pauseAudio returns false if resource does not exist', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.pauseAudio()).toBe(false);
  });

  test('unpauseAudio forwards AudioPlayer unpause method and returns corresponding boolean value', () => {
    const audioPlayerUnpauseSpy = jest.spyOn(AudioPlayer.prototype, 'unpause');
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.unpauseAudio()).toEqual(expect.any(Boolean));
    expect(audioPlayerUnpauseSpy).toHaveBeenCalledTimes(1);
    expect(audioPlayerUnpauseSpy).toHaveBeenCalledWith();          
  });

  test('unpauseAudio returns false if resource does not exist', () => {
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.unpauseAudio()).toBe(false);
  });

  test('addToVoiceConnection forwards VoiceConnection subscribe method and returns corresponding PlayerSubscription object', () => {
    const voiceConnectionMock = ({
      subscribe: jest.fn(() => new PlayerSubscription(null, null)),
    } as unknown) as VoiceConnection;
    const musicPlayerInstance = MusicPlayer.getMusicPlayerInstance();
    expect(musicPlayerInstance.addAudioPlayerToVoiceConnectionSubscriptions(voiceConnectionMock))
      .toBeInstanceOf(PlayerSubscription);
    expect(voiceConnectionMock.subscribe).toHaveBeenCalledTimes(1);
    expect(voiceConnectionMock.subscribe).toHaveBeenCalledWith(expect.any(AudioPlayer));
  });
});


