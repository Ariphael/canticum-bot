import { executePlaylistAddItem } from "./additem";
import { executePlaylistCreate } from "./create";
import { executePlaylistDelete } from "./delete";
import { executePlaylistImport } from "./import";
import { executePlaylistContent } from "./content";
import { executePlaylistLoadToQueue } from "./load";
import { executePlaylistRemoveItem } from "./removeitem";
import { executePlaylistRename } from "./rename";
import { executePlaylistView } from "./view";

export const subcommandMapper = {
  'view': executePlaylistView,
  'content': executePlaylistContent,
  'create': executePlaylistCreate,
  'delete': executePlaylistDelete,
  'rename': executePlaylistRename,
  'additem': executePlaylistAddItem,
  'removeitem': executePlaylistRemoveItem,
  'import': executePlaylistImport,
  'load': executePlaylistLoadToQueue,
}