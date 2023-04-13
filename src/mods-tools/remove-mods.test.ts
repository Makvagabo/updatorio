import fs from 'fs';
import path from 'path';

import { ModsForUpdate, Options, ParsedModList } from '../types';
import { removeMods } from './remove-mods';

jest.mock('fs');

describe('removeMods', () => {
  const mod1 = { name: 'mod1', version: '1.0.0' };
  const mod2 = { name: 'mod2', version: '2.0.0' };
  const mod3 = { name: 'mod3', version: '3.0.0' };
  const modsAvailableForUpdate = [mod1, mod2] as never as ModsForUpdate;

  const options: Pick<Options, 'serverDir'> = {
    serverDir: '/test/server/dir',
  };

  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    mockFs.rmSync.mockClear();
  });

  it('should removes the available for update mods', () => {
    const currentModsList: ParsedModList = [mod1, mod2, mod3];

    removeMods(currentModsList, modsAvailableForUpdate, options);

    expect(mockFs.rmSync).toHaveBeenCalledTimes(2);
    expect(mockFs.rmSync).toHaveBeenCalledWith(
      path.join(options.serverDir, 'mods', `mod1_${mod1.version}.zip`)
    );
    expect(mockFs.rmSync).toHaveBeenCalledWith(
      path.join(options.serverDir, 'mods', `mod2_${mod2.version}.zip`)
    );
  });

  it('should not remove any mods when the current mods list is empty', () => {
    const currentModsList: ParsedModList = [];

    removeMods(currentModsList, modsAvailableForUpdate, options);

    expect(mockFs.rmSync).not.toHaveBeenCalled();
  });

  it('should not remove any mods when no mods available for update match the current mods list', () => {
    const currentModsList: ParsedModList = [mod3];

    removeMods(currentModsList, modsAvailableForUpdate, options);

    expect(mockFs.rmSync).not.toHaveBeenCalled();
  });
});
