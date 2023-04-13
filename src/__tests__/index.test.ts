import { run } from '../cli';
import { initConfig } from '../config';

const mockOptions = {
  modsUrl: 'http://mods.test',
  authUrl: 'http://auth.test',
  semiVersions: 'minor' as const,
  downloadModsUrl: 'http://download.test',
  serverDir: '/server1',
  gameVersion: '1',
  username: 'user',
  password: '1234',
};

jest.mock('../config', () => ({
  initConfig: jest.fn(),
  getConfig: jest.fn(),
}));

jest.mock('../cli', () => ({
  run: jest.fn(),
  getOptions: jest.fn(() => mockOptions),
}));

jest.mock('../main', () => ({
  main: jest.fn(async () => {}),
}));

describe('main success', () => {
  afterAll(() => {
    jest.resetModules();
  });

  it('should init config, run and invoke main function successfully', async () => {
    jest.spyOn(console, 'log').mockImplementation();

    await import('../index');

    expect(initConfig).toHaveBeenCalledWith({
      gameServiceAddress: 'factorio.com',
      defaultOptions: {
        modsUrl: 'https://mods.factorio.com/api/mods',
        downloadModsUrl: 'https://mods.factorio.com',
        authUrl: 'https://auth.factorio.com/api-login',
        semiVersions: 'minor',
        serverDir: './',
        interactive: false,
      },
    });

    expect(run).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Mods updated success!');
  });
});
