import { getOptions } from './cli';
import {
  downloadMods,
  getAvailableModsForUpdate,
  getCurrentModsList,
  getModsFiles,
  makeBackup,
  parseModsFiles,
  removeMods,
  chooseModsForUpdate,
} from './mods-tools';
import { getAuthToken } from './utils';

export async function main() {
  const options = getOptions();

  const modsFiles = getModsFiles(options.serverDir);
  const parsedModsFiles = parseModsFiles(modsFiles);

  const currentModsList = getCurrentModsList(options.serverDir, parsedModsFiles);

  const modsAvailableForUpdate = await getAvailableModsForUpdate(
    options,
    currentModsList
  );

  if (modsAvailableForUpdate.length === 0) {
    return 'No available mods for update!';
  }

  let modsForUpdate = modsAvailableForUpdate;

  if (options.interactive) {
    modsForUpdate = await chooseModsForUpdate(modsAvailableForUpdate, currentModsList);
  }

  if (modsForUpdate.length === 0) {
    return 'No one of available mods for update wasn\'t choose!';
  }

  const authToken = await getAuthToken(options);

  if (options.backup) {
    await makeBackup(modsFiles, options);
  }

  removeMods(currentModsList, modsForUpdate, options);

  await downloadMods(modsForUpdate, options, authToken);
}
