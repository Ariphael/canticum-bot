export type MusicQueueItemType = YoutubeMusicQueueItemType | SpotifyMusicQueueItemType;
type YoutubeMusicQueueItemType = 
  { musicTitle: string, musicId: string, lengthSeconds: string, uploadDate: string };
type SpotifyMusicQueueItemType = 
  { musicTitle: string, musicUri: string, artists: string[], lengthMs: string };