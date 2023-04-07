import { getOptions } from './cli';
import {
  downloadMods,
  getAvailableModsForUpdate,
  getCurrentModsList,
  getModsFiles,
  makeBackup,
  parseModsFiles,
  removeMods
} from './mods-tools';
import { getAuthToken } from './utils/get-auth-token';

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

  const authToken = await getAuthToken(options);

  await makeBackup(modsFiles, options);

  removeMods(currentModsList, modsAvailableForUpdate, options);

  await downloadMods(modsAvailableForUpdate, options, authToken);
}
