import fs from 'fs';

import { initConfig, getConfig } from './index';
import { DEFAULT_OPTIONS } from '../constants';

describe('config', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should init', () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('{"version": "0.6.0-beta.0"}');

    initConfig({
      gameServiceAddress: 'gs.com',
      defaultOptions: {
        ...DEFAULT_OPTIONS,
        serverDir: `src/config/__mocks__`,
      },
    });

    expect(getConfig()).toStrictEqual({
      defaultOptions: {
        modsUrl: 'https://mods.factorio.com/api/mods',
        authUrl: 'https://auth.factorio.com/api-login',
        semiVersions: 'minor',
        serverDir: 'src/config/__mocks__',
        gameVersion: '1.1.76',
        downloadModsUrl: 'https://mods.factorio.com',
        interactive: false,
      },
      gameServiceAddress: 'gs.com',
      version: '0.6.0-beta.0',
    });
  });
});
