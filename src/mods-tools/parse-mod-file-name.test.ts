import { parseModFileName } from './parse-mod-file-name';

describe('parseModFileName', () => {
  it('should parse mod file name', () => {
    const modPath = '/mods/example-mod_1.2.3.zip';
    const expected = {
      name: 'example-mod',
      version: '1.2.3',
    };

    expect(parseModFileName(modPath)).toEqual(expected);
  });

  it('should return info with invalid version if version doesn\'t exist', () => {
    const modPath = '/mods/example-mod.zip';
    const expected = {
      name: 'example-mod',
      version: 'invalid',
    };

    expect(parseModFileName(modPath)).toEqual(expected);
  });

  it('should return info with invalid version if version invalid', () => {
    const modPath = '/mods/example-mod_1.1-rc.zip';
    const expected = {
      name: 'example-mod',
      version: 'invalid',
    };

    expect(parseModFileName(modPath)).toEqual(expected);
  });

  it('should parse mod file names with multiple separators', () => {
    const modPath = '/mods/example_mod-1.2.3_1.2.3-modified.zip';
    const expected = {
      name: 'example_mod-1.2.3',
      version: '1.2.3-modified',
    };

    expect(parseModFileName(modPath)).toEqual(expected);
  });
});
