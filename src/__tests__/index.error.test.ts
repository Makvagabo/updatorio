const error = new Error('description');
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
  main: jest.fn(async () => Promise.reject(error)),
}));

describe('main error', () => {
  afterAll(() => {
    jest.resetModules();
  });

  it('should get reject when invoke main function', async () => {
    jest.spyOn(console, 'error').mockImplementation();

    await import('../index');

    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(console.error).toHaveBeenCalledWith('Error mods update!', error);
  });
});
