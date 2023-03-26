import { getOptions } from './cli';
import {
  downloadMods,
  getAvailableModsForUpdate,
  getCurrentModsList,
  getModsFiles,
  makeBackup,
  removeMods,
} from './mods-tools';
import { getAuthToken } from './utils/get-auth-token';

export async function main() {
  const options = getOptions();

  const modsFiles = getModsFiles(options.serverDir);

  const currentModsList = getCurrentModsList(options.serverDir, modsFiles);

  const modsAvailableForUpdate = await getAvailableModsForUpdate(
    options,
    currentModsList
  );

  if (modsAvailableForUpdate.length === 0) {
    return 'No available mods for update!';
  }

  await makeBackup(modsFiles, options);

  removeMods(currentModsList, modsAvailableForUpdate, options);

  const authToken = await getAuthToken(options);

  await downloadMods(modsAvailableForUpdate, options, authToken);
}
