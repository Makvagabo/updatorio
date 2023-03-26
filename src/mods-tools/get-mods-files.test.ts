import { MOD_EXTENSION } from '../constants';


describe('getModsFiles', () => {
  beforeAll(() => {
    jest.mock('../constants', () => ({
      MODS_DIR_PATH: '/__mocks__/mods',
      MOD_VERSION_SEPARATOR: '_',
      MOD_EXTENSION: '.zip',
    }));
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should return list of only mods files are contained the server', async () => {
    const { getModsFiles } = await import('./get-mods-files');

    expect(getModsFiles(__dirname)).toStrictEqual([
      'aai-containers_0.2.1.zip',
      'aai-industry_0.5.19.zip',
      'aai-signal-transmission_0.4.7.zip',
    ])
  })
});
