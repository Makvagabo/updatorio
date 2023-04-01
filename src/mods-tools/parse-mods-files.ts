import { parseModFileName } from './parse-mod-file-name';

export const parseModsFiles = (modsFiles: string[]) =>
  modsFiles.map((modPath) => {
    const parsedMod = parseModFileName(modPath);
    const { name, version } = parsedMod;

    if (version === 'invalid') {
      console.error(`Mod "${name}" has invalid version!`);
    }

    return parsedMod;
  });
