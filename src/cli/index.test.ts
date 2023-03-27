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
          gameVersion: '1.0',
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

    expect(getOptions()).toStrictEqual({
      modsUrl: 'https://mods.factorio.com/api/mods',
      downloadModsUrl: 'https://mods.factorio.com',
      authUrl: 'https://auth.factorio.com/api-login',
      semiVersions: 'minor',
      serverDir: './',
      username: 'guest',
      password: 'qwerty',
      gameVersion: '1.0',
    });
  });

  it('should have throw error when require options did not pass', async () => {
    const stdoutSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(jest.fn());

    const { run } = await import('../cli');

    const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error('process.exit: ' + number);
    });

    expect(() => run(['node', 'factorio-mods-updater'])).toThrowError();
    expect(stdoutSpy).toHaveBeenCalledWith('error: required option \'--username <value>\' not specified\n');
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it('should validate `game-version` option', async () => {
    const { run, getOptions } = await import('../cli');

    run(['node', 'factorio-mods-updater', '--game-version', '2.0.0', '--username', 'guest', '--password', 'qwerty']);

    let options = getOptions();

    expect(options).toStrictEqual({
      modsUrl: 'https://mods.factorio.com/api/mods',
      downloadModsUrl: 'https://mods.factorio.com',
      authUrl: 'https://auth.factorio.com/api-login',
      semiVersions: 'minor',
      serverDir: './',
      username: 'guest',
      password: 'qwerty',
      gameVersion: '2.0.0',
    });

    run(['node', 'factorio-mods-updater', '--game-version', 'bad', '--username', 'guest', '--password', 'qwerty']);

    options = getOptions();

    expect(options).toStrictEqual({
      modsUrl: 'https://mods.factorio.com/api/mods',
      downloadModsUrl: 'https://mods.factorio.com',
      authUrl: 'https://auth.factorio.com/api-login',
      semiVersions: 'minor',
      serverDir: './',
      username: 'guest',
      password: 'qwerty',
      gameVersion: '1.0',
    });
  });
});
