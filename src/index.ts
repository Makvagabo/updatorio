#!/usr/bin/env node
import { initConfig } from "./config";
import { getOptions, run } from "./cli";
import {
  getCurrentModsList,
  getModsFiles,
  getModsAvailableForUpdate,
  makeBackup,
  downloadMods,
} from "./mods-list";
import { getAuthToken } from "./utils/get-auth-token";

initConfig();

run();

async function main() {
  const options = getOptions();

  const modsFiles = getModsFiles(options.serverDir);

  const currentModsList = getCurrentModsList(modsFiles);

  const modsAvailableForUpdate = await getModsAvailableForUpdate(
    options,
    currentModsList
  );

  if (modsAvailableForUpdate.length === 0) {
    return;
  }

  makeBackup(modsFiles, options);

  const authToken = await getAuthToken(options);

  await downloadMods(modsAvailableForUpdate, options, authToken);
}

main()
  .then(() => {
    console.log("Mods updated success!");
  })
  .catch((e) => {
    console.error("Error mods update!", e);
  });
