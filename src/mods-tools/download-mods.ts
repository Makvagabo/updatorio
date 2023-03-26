import path from 'path';

import { downloadFile } from '../utils/download-file';
import { MODS_DIR_PATH } from '../constants';
import { AvailableModsForUpdate, ProgramOptions } from '../types';

export const downloadMods = async (
  modsAvailableForUpdate: AvailableModsForUpdate,
  options: Pick<ProgramOptions, 'downloadModsUrl' | 'username'>,
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
        params: { username: options.username, authToken },
      },
      path.join(MODS_DIR_PATH, `${file_name}`)
    );
  });

  try {
    await Promise.all(downloads);
  } catch (e) {
    console.error('Download mods error!', e);
  }
};
