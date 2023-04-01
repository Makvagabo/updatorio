import { parseModsFiles } from './parse-mods-files';

describe('parseModsFiles', () => {
  it('should parse mods files correctly', () => {
    const modsFiles = [
      '/home/user/factorio/mods/mod1_1.2.3.zip',
      '/home/user/factorio/mods/mod2_4.5.6.zip',
      '/home/user/factorio/mods/mod3_7.8.9.zip',
    ];
    const expectedParsedMods = [
      { name: 'mod1', version: '1.2.3' },
      { name: 'mod2', version: '4.5.6' },
      { name: 'mod3', version: '7.8.9' },
    ];

    const parsedMods = parseModsFiles(modsFiles);

    expect(parsedMods).toEqual(expectedParsedMods);
  });

  it('should parse single mod file correctly', () => {
    const modsFiles = ['/home/user/factorio/mods/mod1_1.2.3.zip'];
    const expectedParsedMods = [{ name: 'mod1', version: '1.2.3' }];

    const parsedMods = parseModsFiles(modsFiles);

    expect(parsedMods).toEqual(expectedParsedMods);
  });

  it('should parse mods files with no version correctly', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const modsFiles = [
      '/home/user/factorio/mods/mod1.zip',
      '/home/user/factorio/mods/mod2_4.5.zip',
      '/home/user/factorio/mods/mod3_7.8.zip',
    ];
    const expectedParsedMods = [
      { name: 'mod1', version: 'invalid' },
      { name: 'mod2', version: '4.5' },
      { name: 'mod3', version: '7.8' },
    ];

    const parsedMods = parseModsFiles(modsFiles);

    expect(parsedMods).toEqual(expectedParsedMods);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Mod "mod1" has invalid version!`);
  });
});
