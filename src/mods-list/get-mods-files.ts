import path from 'path';
import fs from 'fs';

export const getModsFiles = (serverDir: string) => {
  const modsDir = path.join(serverDir, "/mods");

  return fs.readdirSync(path.join(modsDir, "/"))
}
