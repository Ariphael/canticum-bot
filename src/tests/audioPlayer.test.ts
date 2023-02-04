import * as fs from 'fs';
import { join } from 'path';
// import { 
//   AudioPlayer, 
//   createAudioPlayer, 
//   createAudioResource,
//   NoSubscriberBehavior 
// } from '@discordjs/voice'; 
import * as discordJsVoice from '@discordjs/voice';
import { 
  stopAudioPlayer,
  playAudio,
  getAudioPlayer,
  getAudioPlayerSubscribers,
  resourceSetVolume
} from '../audioplayer/audioPlayer';

// Clear all files in ../../music_downloads folder
const clearMusicDirectory = () => {
  // const directory = "../../music_downloads";

  // readdir(directory, (err, files) => {
  //   if (err) throw err;
  
  //   for (const file of files) {
  //     unlink(join(directory, file), (err) => {
  //       if (err) throw err;
  //     });
  //   }
  // });
}

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
  };
});

beforeEach(() => {
  // jest.restoreAllMocks();
  clearMusicDirectory();
  stopAudioPlayer();
});

afterEach(() => {
  // jest.restoreAllMocks();
  clearMusicDirectory();
  stopAudioPlayer();
});

describe('stopAudioPlayer', () => {
  test('returns false if audio player does not exist', () => {
    expect(getAudioPlayer()).toBe(null);
    expect(stopAudioPlayer()).toBe(false);
  });

  test('stops playback of and destroys the audio player resource', () => {
    const audioPlayerStopSpy = 
      jest.spyOn(discordJsVoice.AudioPlayer.prototype, 'stop')
      .mockImplementation(() => {
        return true;
      });
    createAudioPlayerResource();
    expect(getAudioPlayer()).not.toBe(null);
    expect(stopAudioPlayer()).toBe(true);
    expect(audioPlayerStopSpy).toHaveBeenCalledTimes(1);
    expect(audioPlayerStopSpy).toHaveBeenCalledWith();
  });
});

describe('createAudioPlayerResource', () => {
  test('creates an audio player', () => {
    createAudioPlayerResource();
    expect(getAudioPlayer()).not.toBe(null);
    expect(getAudioPlayer()).toBeInstanceOf(discordJsVoice.AudioPlayer);
  });

  test('configures audio player to pause the stream if there are no active subscribers', () => {
    const spy = jest.spyOn(discordJsVoice, 'createAudioPlayer');
    createAudioPlayerResource();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      behaviors: {
        noSubscriber: discordJsVoice.NoSubscriberBehavior.Pause,
      },
    });
  });
});

describe('playAudio', () => {
  // test('returns false if audio player does not have subscribers', () => {
  //   expect(getAudioPlayerSubscribers()).toStrictEqual([]);
  //   expect(playAudio('test')).toBe(false);
  // });

  // test('returns false if audioId is empty (audio player and file exists)', () => {
  //   createAudioPlayerResource();
  //   fs.writeFile('../../music_downloads/test.mp4', 'test', (err) => {
  //     console.log('c');
  //     if (err) throw err;
  //   });  
  //   expect(playAudio('')).toBe(false);
  // });

  // test('returns false if audioId is empty (audio player and file does not exist)', () => {
  //   expect(playAudio('')).toBe(false);
  // });

  // test('returns false if file does not exist', () => {
  //   createAudioPlayerResource();
  //   fs.writeFile('../../music_downloads/test.mp4', 'test', (err) => {
  //     console.log('c');
  //     if (err) throw err;
  //   });  
  //   expect(playAudio('testtest')).toBe(false);    
  // });
});

describe('resourceSetVolume', () => {
  test('returns false if volume < 0 and audioResource does not exists', () => {
    expect(resourceSetVolume(-1)).toStrictEqual(false);
  });
});

