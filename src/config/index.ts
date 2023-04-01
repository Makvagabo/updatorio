import path from 'path';

import { Config } from '../types';
import { getMode } from '../get-mode';

import * as development from './development';
import * as production from './production';

const configMap = {
  development,
  production,
};

let config: Config;

export const initConfig = (initialConfig: Omit<Config, 'version'>) => {
  if (config) {
    return;
  }

  const mode = getMode();

  const options = { ...initialConfig.defaultOptions };
  const { gameServiceAddress = 'factorio.com' } = initialConfig;

  const factorioServerBinFile = path.join(
    options.serverDir,
    'bin/x64/factorio'
  );

  config = {
    version: configMap[mode].getProgramVersion(),
    gameServiceAddress,
    defaultOptions: {
      ...options,
      gameVersion: configMap[mode].getFactorioVersion(factorioServerBinFile),
    },
  };
};

export const getConfig = () => config;
