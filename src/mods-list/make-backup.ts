import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { MODS_DIR_PATH } from '../constants';
import { getUniquePostfix } from '../utils/get-unique-postfix';
import { ProgramOptions } from '../types';

export const makeBackup = (modsFiles: string[], options: Pick<ProgramOptions, 'serverDir'>) => {
  const zip = new JSZip();
  const modsBackup = zip.folder("mods_backup");

  modsFiles.forEach((file) => {
    const filesData = fs.readFileSync(
      path.join(options.serverDir, MODS_DIR_PATH, `${file}`)
    );
    modsBackup?.file(file, filesData);
  });

  return new Promise((resolve, reject) => {
    const a = zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(`mods_backup_${getUniquePostfix()}.zip`));

      a.on("finish", () => {
        console.log("Backup of mods was created success!");

        fs.rmSync(path.join(options.serverDir, `mods`), { recursive: true, force: true });
        fs.mkdirSync(path.join(options.serverDir, `mods`));

        console.log("Mods folder was removed!");
        resolve(true);
      })
      .on("error", (error) => {
        console.error("An error has occurred in the removing mods folder process!");
        reject(error);
      });
  });
}
