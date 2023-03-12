import { Options } from "./types";

export const MODS_DIR_PATH = "mods/";

export const GAME_SERVICE_ADDRESS = "factorio.com";

export const DEFAULT_OPTIONS: Options = {
  modsUrl: "https://mods.factorio.com/api/mods",
  downloadModsUrl: "https://mods.factorio.com",
  authUrl: "https://auth.factorio.com/api-login",
  semiVersions: "minor",
  serverDir: "./",
};
