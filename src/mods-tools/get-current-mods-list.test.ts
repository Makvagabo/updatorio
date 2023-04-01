describe('getCurrentModsList', () => {
  beforeAll(() => {
    jest.mock('../constants', () => ({
      MODS_DIR_PATH: '/__mocks__/mods',
      MOD_VERSION_SEPARATOR: '_',
    }));
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should return mods list is based on the json manifest', async () => {
    const parsedModsFiles = [
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: 'invalid' },
    ];

    const { getCurrentModsList } = await import('./get-current-mods-list');

    expect(getCurrentModsList(__dirname, parsedModsFiles)).toStrictEqual([
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
    ]);
  });

  it('should return empty list if mods files was empty', async () => {
    const { getCurrentModsList } = await import('./get-current-mods-list');

    expect(getCurrentModsList(__dirname, [])).toStrictEqual([]);
  });
});
