import fs from 'fs';
import path from 'path';

import { AvailableModsForUpdate, Options, ParsedModList } from '../types';
import { MOD_EXTENSION, MOD_VERSION_SEPARATOR } from '../constants';

export const removeMods = (
  currentModsList: ParsedModList,
  modsAvailableForUpdate: AvailableModsForUpdate,
  options: Pick<Options, 'serverDir'>
) => {
  currentModsList
    .filter((currentMod) =>
      modsAvailableForUpdate.filter(
        (availableModForUpdate) =>
          availableModForUpdate.name === currentMod.name
      )
    )
    .forEach(({ name, version }) => {
      fs.rmSync(
        path.join(
          options.serverDir,
          `mods`,
          `${name}${MOD_VERSION_SEPARATOR}${version}${MOD_EXTENSION}`
        )
      );
    });
};
