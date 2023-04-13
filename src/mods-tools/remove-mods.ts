import fs from 'fs';
import path from 'path';

import { ModsForUpdate, Options, ParsedModList } from '../types';
import {
  MOD_EXTENSION,
  MOD_VERSION_SEPARATOR,
  MODS_DIR_PATH,
} from '../constants';

export const removeMods = (
  currentModsList: ParsedModList,
  modsAvailableForUpdate: ModsForUpdate,
  options: Pick<Options, 'serverDir'>
) => {
  currentModsList
    .filter((currentMod) =>
      modsAvailableForUpdate.find(
        (availableModForUpdate) =>
          availableModForUpdate.name === currentMod.name
      )
    )
    .forEach(({ name, version }) => {
      fs.rmSync(
        path.join(
          options.serverDir,
          MODS_DIR_PATH,
          `${name}${MOD_VERSION_SEPARATOR}${version}${MOD_EXTENSION}`
        )
      );
    });
};
