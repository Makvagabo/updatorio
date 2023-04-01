import path from 'path';
import fs from 'fs';

import { ModList, ParsedModFiles, ParsedModList } from '../types';
import { MODS_DIR_PATH } from '../constants';

const modsExcludes = ['base'];

export const getCurrentModsList = (
  serverDir: string,
  parsedModsFiles: ParsedModFiles
) => {
  const { mods } = JSON.parse(
    fs
      .readFileSync(path.join(serverDir, MODS_DIR_PATH, 'mod-list.json'))
      .toString()
  ) as ModList;

  return mods
    .map(({ name }) => name)
    .filter((name) => !modsExcludes.includes(name))
    .reduce<ParsedModList>((acc, modName) => {
      const modFile = parsedModsFiles.find((mod) => mod.name === modName);

      if (!modFile) {
        return acc;
      }

      const { version } = modFile;

      if (version === 'invalid') {
        return acc;
      }

      return [
        ...acc,
        {
          name: modName,
          version,
        },
      ];
    }, []);
};
