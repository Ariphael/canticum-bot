import { executePlaylistInfo } from "./info";
import { executePlaylistView } from "./view";

export const subcommandMapper = {
  'view': executePlaylistView,
  'info': executePlaylistInfo,
}