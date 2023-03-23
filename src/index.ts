#!/usr/bin/env node
import { initConfig } from './config';
import { getOptions, run } from './cli';
import {
  getCurrentModsList,
  getModsFiles,
  getAvailableModsForUpdate,
  makeBackup,
  downloadMods,
} from './mods-list';
import { getAuthToken } from './utils/get-auth-token';
import { DEFAULT_OPTIONS, GAME_SERVICE_ADDRESS } from './constants';

initConfig({
  gameServiceAddress: GAME_SERVICE_ADDRESS,
  defaultOptions: DEFAULT_OPTIONS,
});

run();

async function main() {
  const options = getOptions();

  const modsFiles = getModsFiles(options.serverDir);

  const currentModsList = getCurrentModsList(options.serverDir, modsFiles);

  const modsAvailableForUpdate = await getAvailableModsForUpdate(
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
    console.log('Mods updated success!');
  })
  .catch((e) => {
    console.error('Error mods update!', e);
  });
