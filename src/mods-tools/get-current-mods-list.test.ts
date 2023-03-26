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
    const modsFiles = [
      'aai-containers_0.2.1.zip',
      'aai-industry_0.5.19.zip',
      'aai-signal-transmission_0.4.7.zip',
    ];

    const { getCurrentModsList } = await import('./get-current-mods-list');

    expect(getCurrentModsList(__dirname, modsFiles)).toStrictEqual([
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ]);
  });

  it('should return empty list if mods files was empty', async () => {
    const { getCurrentModsList } = await import('./get-current-mods-list');

    expect(getCurrentModsList(__dirname, [])).toStrictEqual([]);
  });
});
