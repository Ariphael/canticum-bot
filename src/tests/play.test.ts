import * as discordJsVoice from '@discordjs/voice';
import axios, { AxiosResponse } from 'axios';
import { play } from '../commands/play';
import { getClientMock } from '../mocks/mocks';
import { getChatInputCommandInteractionMock } from '../mocks/play.test.mocks';
import { MusicPlayer } from '../musicplayer/MusicPlayer';
import { addSongRequest, clearQueue } from '../queue/songQueue';

const client = getClientMock();
const interaction = getChatInputCommandInteractionMock();

const discordJsVoiceConnectionMock = ({} as unknown) as discordJsVoice.VoiceConnection;
const axiosReponseMock = ({
  data: {
    items: [{
        snippet: {
          title: 'AAAAAAAAAAA',
        },
        id: {
          videoId: 'AAAAAAAAAAA',
        }
      },
    ]
  }
} as unknown) as AxiosResponse<any, any>;

jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
  };
});

jest.mock('axios', () => jest.fn(() => Promise.resolve(axiosReponseMock)));

jest.mock('ytdl-core', () => {
  return {
    getInfo: jest.fn((url: string) => {
        if (url === 'https://www.youtube.com/watch?v=FFFFFFFFFFF')
          return Promise.reject();
        return Promise.resolve({
          videoDetails: {
            title: 'AAAAAAAAAAA',
            videoId: 'AAAAAAAAAAA',
          }
        });
    }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  clearQueue();
});

afterEach(() => {
  jest.clearAllMocks();
  clearQueue();
});

describe('play command fail cases', () => {
  test('sends a message to channel if voice connection does not exist', async () => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection')
      .mockImplementationOnce(() => undefined);
    await play.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
      ephemeral: expect.any(Boolean),
    });
  });

  test('sends a message to channel if song is not found', async () => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection')
      .mockImplementationOnce(() => discordJsVoiceConnectionMock);
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=FFFFFFFFFFF');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(false);
    jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);
    await play.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);   
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    });     
  });
});

describe('play command success cases', () => {
  beforeEach(() => {
    jest.spyOn(discordJsVoice, 'getVoiceConnection')
      .mockImplementationOnce(() => discordJsVoiceConnectionMock);
  });

  test('plays audio if initial size of queue = 0, audio player is idle and query is not a yt link', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'query');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(false);
    const musicPlayerPlayAudioSpy = jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);
    await play.run(client, interaction);
    expect(musicPlayerPlayAudioSpy).toHaveBeenCalledTimes(1);
  });

  test('plays audio if initial size of queue = 0, audio player is idle and query is a yt link', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=AAAAAAAAAAA'); 
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(false);
    const musicPlayerPlayAudioSpy = jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);   
    await play.run(client, interaction);
    expect(musicPlayerPlayAudioSpy).toHaveBeenCalledTimes(1);
  });

  test('sends message to channel if initial size of queue = 0, audio player is idle and query is not yt link', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'query');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(false);
    jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);
    await play.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);   
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    }); 
  });

  test('sends message to channel if initial size of queue = 0, audio player is playing a resource and query is not yt link', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'query');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(true);
    jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);
    
    await play.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);   
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    }); 
  });

  test('sends message to channel if initial size of queue = 0, audio player is idle and query is a yt link', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=AAAAAAAAAAA');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(false);
    jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);
    
    await play.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);   
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    }); 
  });

  test('sends message to channel if queue was initially empty, audio player was playing resource and query was yt link', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=AAAAAAAAAAA');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(true);
    jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);
    
    await play.run(client, interaction);
    expect(interaction.reply).toHaveBeenCalledTimes(1);   
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.any(String),
      components: [],
      embeds: [expect.any(Object)],
    }); 
  });

  test('does not play audio if a song is currently playing and initial size of queue is 0', async () => {
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=AAAAAAAAAAA');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(true);
    const musicPlayerPlayAudioSpy = jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);   
    await play.run(client, interaction);
    expect(musicPlayerPlayAudioSpy).not.toHaveBeenCalled();    
  });

  test('does not play audio if a song is not currently playing and initial size of queue > 0', async () => {
    addSongRequest('mt', 'mid');
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=AAAAAAAAAAA');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(false);
    const musicPlayerPlayAudioSpy = jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);    
    await play.run(client, interaction);
    expect(musicPlayerPlayAudioSpy).not.toHaveBeenCalled();  
  });

  test('does not play audio if a song is currently playing and initial size of queue > 0', async () => {
    addSongRequest('mt', 'mid');
    jest.spyOn(interaction.options, 'getString')
      .mockImplementationOnce(() => 'https://www.youtube.com/watch?v=AAAAAAAAAAA');
    jest.spyOn(MusicPlayer.prototype, 'isPlayingAudio')
      .mockReturnValueOnce(true);
    const musicPlayerPlayAudioSpy = jest.spyOn(MusicPlayer.prototype, 'playAudio')
      .mockImplementationOnce(() => false);   
    await play.run(client, interaction);
    expect(musicPlayerPlayAudioSpy).not.toHaveBeenCalled();    
  });
});