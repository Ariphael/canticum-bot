import { RowDataPacket } from "mysql2";
import { MusicQueueItemType } from "./musicQueueItem";

export interface PlaylistItem {
  musicTitle: string,
  musicId: string, 
  uploader: string, 
  originalURL: string,
  enqueuerMemberId: string,
  dateCreated: string,
};