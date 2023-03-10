import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { MODS_DIR_PATH } from '../constants';
import { getUniquePostfix } from '../utils/get-unique-postfix';
import { ProgramOptions } from '../types';

export const makeBackup = (modsFiles: string[], options: ProgramOptions) => {
  const zip = new JSZip();
  const modsBackup = zip.folder("mods_backup");

  modsFiles.forEach((file) => {
    const filesData = fs.readFileSync(
      path.join(options.serverDir, MODS_DIR_PATH, `${file}`)
    );
    modsBackup?.file(file, filesData);
  });

  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(fs.createWriteStream(`mods_backup_${getUniquePostfix()}.zip`))
    .on("finish", function () {
      console.log("Backup of mods was created success!");

      fs.rmSync(path.join(options.serverDir, `mods`));
      fs.mkdirSync(path.join(options.serverDir, `mods`));
    });
}
