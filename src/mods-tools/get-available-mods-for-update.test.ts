import axios from 'axios';
import https from 'https';

import { getAvailableModsForUpdate } from './get-available-mods-for-update';

jest.mock('axios');

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('getModsAvailableForUpdate', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.dontMock('axios');
  });

  it('should make a request for the new mods releases', async () => {
    const modsReleasesInfoData = await import(
      './__mocks__/mods/mods-releases-info-data-200.json'
    );
    const currentModsList = [
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'minor' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockResolvedValueOnce({
      status: 200,
      data: modsReleasesInfoData,
    });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mods.com',
      params: {
        namelist: 'aai-containers,aai-industry,aai-signal-transmission',
      },
      httpsAgent: expect.any(https.Agent),
    });
    expect(result).toStrictEqual([
      {
        name: 'aai-containers',
        availableVersionForUpdate: {
          download_url: '/download/aai-containers/62bce7638ed1b6ac27b67aaa',
          file_name: 'aai-containers_0.2.11.zip',
          info_json: {
            factorio_version: '1.1',
          },
          released_at: '2022-06-29T23:59:31.508000Z',
          version: '0.2.11',
          sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0',
        },
      },
    ]);
  });

  it('should return new beta mod if you want to update it', async () => {
    const modsReleasesInfoData = await import(
      './__mocks__/mods/mods-releases-info-data-with-beta-200.json'
      );
    const currentModsList = [
      { name: 'aai-containers', version: '0.1.0' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'beta' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockResolvedValueOnce({
      status: 200,
      data: modsReleasesInfoData,
    });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(result).toStrictEqual([
      {
        name: 'aai-containers',
        availableVersionForUpdate: {
          download_url: '/download/aai-containers/62bce7638ed1b6ac27b67aaa',
          file_name: 'aai-containers_0.3.0.zip',
          info_json: {
            factorio_version: '1.1',
          },
          released_at: '2022-06-29T23:59:31.508000Z',
          version: '0.3.0',
          sha1: 'ba3635dfe00f34307aace6f3f0e80c747207e4f0',
        },
      },
    ]);
  });

  // TODO: add more positive test cases

  it('should return the empty list if there was an error', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());
    const currentModsList = [
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'minor' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockRejectedValueOnce({ status: 503 });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during the getting available mods for update!',
      { status: 503 }
    );
    expect(result).toStrictEqual([]);
  });

  it('should return the empty list if received mod is uninstalled', async () => {
    const modsReleasesInfoData = await import(
      './__mocks__/mods/mods-releases-info-data-with-uninstalled-mod-200.json'
    );
    const currentModsList = [
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'minor' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockResolvedValueOnce({
      status: 200,
      data: modsReleasesInfoData,
    });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(result).toStrictEqual([]);
  });

  it('should return the empty list if received mod has a new major game version', async () => {
    const modsReleasesInfoData = await import(
      './__mocks__/mods/mods-releases-info-data-with-new-version-games-mod-200.json'
    );
    const currentModsList = [
      { name: 'aai-containers', version: '0.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'minor' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockResolvedValueOnce({
      status: 200,
      data: modsReleasesInfoData,
    });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(result).toStrictEqual([]);
  });

  it('should return the empty list if received mods version is not satisfied conditions of semiversion', async () => {
    const modsReleasesInfoData = await import(
      './__mocks__/mods/mods-releases-info-data-with-dismatch-version-mod-200.json'
    );
    const currentModsList = [
      { name: 'aai-containers', version: '1.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'patch' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockResolvedValueOnce({
      status: 200,
      data: modsReleasesInfoData,
    });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(result).toStrictEqual([]);
  });

  it('should return the empty list if received mods don`t contain releases', async () => {
    const modsReleasesInfoData = await import(
      './__mocks__/mods/mods-releases-info-data-without-releases-200.json'
    );
    const currentModsList = [
      { name: 'aai-containers', version: '1.2.1' },
      { name: 'aai-industry', version: '0.5.19' },
      { name: 'aai-signal-transmission', version: '0.4.7' },
    ];
    const options = {
      modsUrl: 'https://mods.com',
      semiVersions: 'patch' as const,
      gameVersion: '1.70',
    };

    mockedAxios.mockResolvedValueOnce({
      status: 200,
      data: modsReleasesInfoData,
    });

    const result = await getAvailableModsForUpdate(options, currentModsList);

    expect(result).toStrictEqual([]);
  });
});
