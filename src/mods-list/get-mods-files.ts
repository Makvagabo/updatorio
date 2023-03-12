import path from 'path';
import fs from 'fs';

import { MODS_DIR_PATH } from '../constants';

export const getModsFiles = (serverDir: string) => {
  const modsDir = path.join(serverDir, MODS_DIR_PATH);

  return fs
    .readdirSync(path.join(modsDir, '/'))
    .filter((name) => path.extname(name) === '.zip');
};
