describe('cli', () => {
  beforeAll(() => {
    jest.mock('../config', () => ({
      getConfig: () => ({
        version: '1.0',
        gameServiceAddress: "factorio.com",
        defaultOptions: {
          modsUrl: "https://mods.factorio.com/api/mods",
          downloadModsUrl: "https://mods.factorio.com",
          authUrl: "https://auth.factorio.com/api-login",
          semiVersions: "minor",
          serverDir: "./",
        },
      }),
    }));
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should have all required and default options', async () => {
    const { run, getOptions } = await import('../cli');

    run(['node', 'factorio-mods-updater', '--username', 'guest', '--password', 'qwerty']);

    const options = getOptions();

    expect(options).toStrictEqual({
      modsUrl: 'https://mods.factorio.com/api/mods',
      authUrl: 'https://auth.factorio.com/api-login',
      semiVersions: 'minor',
      serverDir: './',
      username: 'guest',
      password: 'qwerty'
    });
  });
});
