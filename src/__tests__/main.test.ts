import { getOptions } from '../cli';
import { getAuthToken } from '../utils';
import {
  downloadMods,
  getAvailableModsForUpdate,
  getCurrentModsList,
  getModsFiles,
  makeBackup,
  parseModsFiles,
  removeMods,
  chooseModsForUpdate,
} from '../mods-tools';
import { main } from '../main';

import {
  mockAuthToken,
  mockAvailableModsForUpdate,
  mockCurrentModsList,
  mockModsFiles,
  mockParsedModsFiles,
  mockOptions,
  mockModsForUpdate,
} from '../__mocks__/main';

jest.mock('../mods-tools', () => ({
  getModsFiles: jest.fn(() => mockModsFiles),
  getCurrentModsList: jest.fn(() => mockCurrentModsList),
  getAvailableModsForUpdate: jest.fn(async () => mockAvailableModsForUpdate),
  makeBackup: jest.fn(async () => true),
  downloadMods: jest.fn(async () => {}),
  removeMods: jest.fn(),
  parseModsFiles: jest.fn(() => mockParsedModsFiles),
  chooseModsForUpdate: jest.fn(async () => mockModsForUpdate),
}));

jest.mock('../config', () => ({
  getConfig: jest.fn(),
}));

jest.mock('../cli', () => ({
  getOptions: jest.fn(() => mockOptions),
}));

jest.mock('../utils/get-auth-token', () => ({
  getAuthToken: jest.fn(async () => mockAuthToken),
}));

describe('main', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should call and run all operations', async () => {
    await main();

    expect(getOptions).toHaveBeenCalledTimes(1);

    expect(getModsFiles).toHaveBeenCalledTimes(1);
    expect(getModsFiles).toHaveBeenCalledWith(mockOptions.serverDir);

    expect(parseModsFiles).toHaveBeenCalledTimes(1);
    expect(parseModsFiles).toHaveBeenCalledWith(mockModsFiles);

    expect(getCurrentModsList).toHaveBeenCalledTimes(1);
    expect(getCurrentModsList).toHaveBeenCalledWith(
      mockOptions.serverDir,
      mockParsedModsFiles
    );

    expect(getAvailableModsForUpdate).toHaveBeenCalledTimes(1);
    expect(getAvailableModsForUpdate).toHaveBeenCalledWith(
      mockOptions,
      mockCurrentModsList
    );
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(chooseModsForUpdate).not.toBeCalled();

    expect(getAuthToken).toHaveBeenCalledTimes(1);
    expect(getAuthToken).toHaveBeenCalledWith(mockOptions);
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(makeBackup).toHaveBeenCalledTimes(1);
    expect(makeBackup).toHaveBeenCalledWith(mockModsFiles, mockOptions);
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(removeMods).toHaveBeenCalledTimes(1);
    expect(removeMods).toHaveBeenCalledWith(
      mockCurrentModsList,
      mockAvailableModsForUpdate,
      mockOptions
    );

    expect(downloadMods).toHaveBeenCalledTimes(1);
    expect(downloadMods).toHaveBeenCalledWith(
      mockAvailableModsForUpdate,
      mockOptions,
      mockAuthToken
    );
  });

  it('should the list of mods for update be different from available list if the interactive mode turned on', async () => {
    const optionsWithInteractiveModOn = {
      ...mockOptions,
      interactive: true,
    };
    (getOptions as jest.MockedFn<typeof getOptions>).mockImplementation(
      () => optionsWithInteractiveModOn
    );

    await main();

    expect(chooseModsForUpdate).toHaveBeenCalledTimes(1);
    expect(chooseModsForUpdate).toHaveBeenCalledWith(
      mockAvailableModsForUpdate,
      mockCurrentModsList
    );
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(removeMods).toHaveBeenCalledTimes(1);
    expect(removeMods).toHaveBeenCalledWith(
      mockCurrentModsList,
      mockModsForUpdate,
      optionsWithInteractiveModOn
    );

    expect(downloadMods).toHaveBeenCalledTimes(1);
    expect(downloadMods).toHaveBeenCalledWith(
      mockModsForUpdate,
      optionsWithInteractiveModOn,
      mockAuthToken
    );
  });

  it('should not mak a backup by the option', async () => {
    const optionsWithInteractiveModOn = {
      ...mockOptions,
      backup: false,
    };
    (getOptions as jest.MockedFn<typeof getOptions>).mockImplementation(
      () => optionsWithInteractiveModOn
    );

    await main();

    expect(getOptions).toHaveBeenCalledTimes(1);

    expect(getModsFiles).toHaveBeenCalledTimes(1);
    expect(getModsFiles).toHaveBeenCalledWith(optionsWithInteractiveModOn.serverDir);

    expect(parseModsFiles).toHaveBeenCalledTimes(1);
    expect(parseModsFiles).toHaveBeenCalledWith(mockModsFiles);

    expect(getCurrentModsList).toHaveBeenCalledTimes(1);
    expect(getCurrentModsList).toHaveBeenCalledWith(
      optionsWithInteractiveModOn.serverDir,
      mockParsedModsFiles
    );

    expect(getAvailableModsForUpdate).toHaveBeenCalledTimes(1);
    expect(getAvailableModsForUpdate).toHaveBeenCalledWith(
      optionsWithInteractiveModOn,
      mockCurrentModsList
    );
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(chooseModsForUpdate).not.toBeCalled();

    expect(getAuthToken).toHaveBeenCalledTimes(1);
    expect(getAuthToken).toHaveBeenCalledWith(optionsWithInteractiveModOn);
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(makeBackup).not.toBeCalled();

    expect(removeMods).toHaveBeenCalledTimes(1);
    expect(removeMods).toHaveBeenCalledWith(
      mockCurrentModsList,
      mockAvailableModsForUpdate,
      optionsWithInteractiveModOn
    );

    expect(downloadMods).toHaveBeenCalledTimes(1);
    expect(downloadMods).toHaveBeenCalledWith(
      mockAvailableModsForUpdate,
      optionsWithInteractiveModOn,
      mockAuthToken
    );
  });

  describe('should not make a backup and download', () => {
    afterEach(() => {
      expect(makeBackup).not.toBeCalled();
      expect(removeMods).not.toBeCalled();
      expect(downloadMods).not.toBeCalled();
    });

    it('when have no available mods for update', async () => {
      (
        getAvailableModsForUpdate as jest.MockedFunction<
          typeof getAvailableModsForUpdate
        >
      ).mockResolvedValueOnce([]);

      await main();

      await new Promise((res) => setTimeout(() => res(true), 0));

      expect(getAuthToken).not.toBeCalled();
    });

    it('when user has chose mods', async () => {
      const optionsWithInteractiveModOn = {
        ...mockOptions,
        interactive: true,
      };
      (getOptions as jest.MockedFn<typeof getOptions>).mockImplementation(
        () => optionsWithInteractiveModOn
      );
      (
        chooseModsForUpdate as jest.MockedFunction<typeof chooseModsForUpdate>
      ).mockResolvedValueOnce([]);

      await main();

      await new Promise((res) => setTimeout(() => res(true), 0));

      expect(getAuthToken).not.toBeCalled();
    });

    it('when auth token request was rejected', async () => {
      const error = Error('Invalid Parameters');
      (
        getAuthToken as jest.MockedFunction<typeof getAuthToken>
      ).mockRejectedValueOnce(error);

      await expect(main()).rejects.toThrow(error);

      await new Promise((res) => setTimeout(() => res(true), 0));

      expect(getAuthToken).toHaveBeenCalledTimes(1);
    });
  });
});
