import path from 'path';
import fs from 'fs';

import { ModList, ParsedModList } from '../types';
import { MOD_VERSION_SEPARATOR, MODS_DIR_PATH } from '../constants';

const modsExcludes = ['base'];

export const getCurrentModsList = (serverDir: string, modsFiles: string[]) => {
  const { mods } = JSON.parse(
    fs
      .readFileSync(path.join(serverDir, MODS_DIR_PATH, 'mod-list.json'))
      .toString()
  ) as ModList;

  return mods
    .map(({ name }) => name)
    .filter((name) => !modsExcludes.includes(name))
    .reduce<ParsedModList>((acc, ModName) => {
      const modPath = modsFiles.find((fileName) => fileName.includes(ModName));

      if (!modPath) {
        return acc;
      }

      const currentModVersion = path
        .parse(modPath)
        .name.split(MOD_VERSION_SEPARATOR)
        .pop();

      if (!currentModVersion) {
        return acc;
      }

      return [
        ...acc,
        {
          name: ModName,
          version: currentModVersion,
        },
      ];
    }, []);
};
