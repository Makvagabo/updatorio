import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const getProgramVersion = () =>
  JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString())
    .version;

export const getFactorioVersion = (factorioServerBinFile: string) => {
  const [version] = execSync(`${factorioServerBinFile} --version`)
    .toString()
    .split('\n')[0]
    .match(/\d+\.\d+\.\d+/) || ['1.0.0'];

  return version;
};
