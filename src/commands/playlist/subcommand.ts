import { executePlaylistAddItem } from "./additem";
import { executePlaylistCreate } from "./create";
import { executePlaylistDelete } from "./delete";
import { executePlaylistInfo } from "./info";
import { executePlaylistLoadToQueue } from "./load";
import { executePlaylistRemoveItem } from "./removeitem";
import { executePlaylistRename } from "./rename";
import { executePlaylistView } from "./view";

export const subcommandMapper = {
  'view': executePlaylistView,
  'info': executePlaylistInfo,
  'create': executePlaylistCreate,
  'delete': executePlaylistDelete,
  'rename': executePlaylistRename,
  'additem': executePlaylistAddItem,
  'removeitem': executePlaylistRemoveItem,
  'load': executePlaylistLoadToQueue,
}