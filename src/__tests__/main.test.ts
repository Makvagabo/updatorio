import { getOptions } from '../cli';
import { getAuthToken } from '../utils/get-auth-token';
import {
  downloadMods,
  getAvailableModsForUpdate,
  getCurrentModsList,
  getModsFiles,
  makeBackup,
} from '../mods-list';
import { main } from '../main';
import {
  mockAuthToken,
  mockAvailableModsForUpdate,
  mockCurrentModsList,
  mockModsFiles,
  mockOptions,
} from '../__mocks__/main';

jest.mock('../mods-list', () => ({
  getModsFiles: jest.fn(() => mockModsFiles),
  getCurrentModsList: jest.fn(() => mockCurrentModsList),
  getAvailableModsForUpdate: jest.fn(async () => mockAvailableModsForUpdate),
  makeBackup: jest.fn(async () => true),
  downloadMods: jest.fn(async () => true),
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

describe('index', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should call and run all operations', async () => {
    jest.spyOn(console, 'log').mockImplementation();

    await main();

    expect(getOptions).toHaveBeenCalledTimes(1);

    expect(getModsFiles).toHaveBeenCalledTimes(1);
    expect(getModsFiles).toHaveBeenCalledWith(mockOptions.serverDir);

    expect(getCurrentModsList).toHaveBeenCalledTimes(1);
    expect(getCurrentModsList).toHaveBeenCalledWith(
      mockOptions.serverDir,
      mockModsFiles
    );

    expect(getAvailableModsForUpdate).toHaveBeenCalledTimes(1);
    expect(getAvailableModsForUpdate).toHaveBeenCalledWith(
      mockOptions,
      mockCurrentModsList
    );
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(makeBackup).toHaveBeenCalledTimes(1);
    expect(makeBackup).toHaveBeenCalledWith(mockModsFiles, mockOptions);
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(getAuthToken).toHaveBeenCalledTimes(1);
    expect(getAuthToken).toHaveBeenCalledWith(mockOptions);
    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(downloadMods).toHaveBeenCalledTimes(1);
    expect(downloadMods).toHaveBeenCalledWith(
      mockAvailableModsForUpdate,
      mockOptions,
      mockAuthToken
    );
  });

  it('should not make a backup if have no available mods for update', async () => {
    jest.spyOn(console, 'log').mockImplementation();
    (
      getAvailableModsForUpdate as jest.MockedFunction<any>
    ).mockResolvedValueOnce([]);

    await main();

    await new Promise((res) => setTimeout(() => res(true), 0));

    expect(makeBackup).toHaveBeenCalledTimes(0);

    expect(getAuthToken).toHaveBeenCalledTimes(0);

    expect(downloadMods).toHaveBeenCalledTimes(0);
  });
});
