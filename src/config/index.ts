import { Config } from '../types';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

let config: Config;

export const initConfig = (initialConfig: Omit<Config, 'version'>) => {
  if (config) {
    return;
  }

  const options = { ...initialConfig.defaultOptions };
  const { gameServiceAddress = 'factorio.com' } = initialConfig;

  const packageInfo = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json')).toString()
  );
  const factorioServerBinFile = path.join(
    options.serverDir,
    'bin/x64/factorio'
  );

  const [factorioVersion] =
    execSync(`${factorioServerBinFile} --version`)
      .toString()
      .split('\n')[0]
      .match(/\d+\.\d+\.\d+/) || [];

  options.gameVersion = factorioVersion || '1.0';

  config = {
    version: packageInfo.version,
    gameServiceAddress,
    defaultOptions: options,
  };
};

export const getConfig = () => config;
