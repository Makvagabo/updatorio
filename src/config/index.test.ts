import { initConfig, getConfig } from './index';
import { DEFAULT_OPTIONS } from '../constants';

describe('config', () => {
  it('should init', () => {
    initConfig({
      gameServiceAddress: 'gs.com',
      defaultOptions: {
        ...DEFAULT_OPTIONS,
        serverDir: `${__dirname}/__mocks__`,
      },
    });

    expect(getConfig()).toStrictEqual({
      defaultOptions: {
        modsUrl: 'https://mods.factorio.com/api/mods',
        authUrl: 'https://auth.factorio.com/api-login',
        semiVersions: 'minor',
        serverDir: '/home/makvagabo/projects/updatorio/src/config/__mocks__',
        gameVersion: '1.1.76',
        downloadModsUrl: 'https://mods.factorio.com',
      },
      gameServiceAddress: 'gs.com',
      version: expect.any(String),
    });
  });
});
