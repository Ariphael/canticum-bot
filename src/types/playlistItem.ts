import { RowDataPacket } from "mysql2";
import { MusicQueueItemType } from "./musicQueueItem";

export interface PlaylistItem extends MusicQueueItemType {
    dateCreated: string,
};