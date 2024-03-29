import path from 'path';

import { downloadFile } from '../utils';
import { MODS_DIR_PATH } from '../constants';
import { ModsForUpdate, ProgramOptions } from '../types';

/**
 * Download mods available for update
 * For more information look at https://wiki.factorio.com/Mod_portal_API#Downloading_Mods
 */
export const downloadMods = async (
  modsAvailableForUpdate: ModsForUpdate,
  options: Pick<ProgramOptions, 'downloadModsUrl' | 'username' | 'serverDir'>,
  authToken: string
) => {
  const downloads = modsAvailableForUpdate.map((mod) => {
    const {
      availableVersionForUpdate: { download_url, file_name },
    } = mod;

    return downloadFile(
      {
        baseURL: options.downloadModsUrl,
        method: 'GET',
        url: download_url,
        params: { username: options.username, token: authToken },
      },
      path.join(options.serverDir, MODS_DIR_PATH, `${file_name}`)
    );
  });

  try {
    await Promise.all(downloads);
  } catch (e) {
    console.error('Download mods error!', e);
  }
};
