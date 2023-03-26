import path from 'path';

import { downloadFile } from '../utils/download-file';
import { downloadMods } from './download-mods';
import { MODS_DIR_PATH } from '../constants';

jest.mock('../utils/download-file');

const mockDownloadFile = downloadFile as jest.MockedFunction<
  typeof downloadFile
>;

describe('downloadMods', () => {
  beforeEach(() => {
    mockDownloadFile.mockClear();
  });

  it('should call downloadFile for each mod', async () => {
    const modsAvailableForUpdate = [
      {
        name: 'mod1',
        availableVersionForUpdate: {
          download_url: 'http://example.com/mod1.zip',
          file_name: 'mod1.zip',
          info_json: { factorio_version: '1.0' },
          released_at: '2022-03-15T12:00:00Z',
          version: '1.1.0',
          sha1: 'abcd1234',
        },
      },
      {
        name: 'mod2',
        availableVersionForUpdate: {
          download_url: 'http://example.com/mod2.zip',
          file_name: 'mod2.zip',
          info_json: { factorio_version: '1.1' },
          released_at: '2022-03-16T12:00:00Z',
          version: '2.0.0',
          sha1: 'efgh5678',
        },
      },
    ];
    const options = {
      downloadModsUrl: 'http://example.com/download',
      username: 'user',
    };
    const authToken = '1234';

    await downloadMods(modsAvailableForUpdate, options, authToken);

    expect(mockDownloadFile).toHaveBeenCalledTimes(2);
    expect(mockDownloadFile).toHaveBeenCalledWith(
      {
        baseURL: options.downloadModsUrl,
        method: 'GET',
        url: modsAvailableForUpdate[0].availableVersionForUpdate.download_url,
        params: { username: options.username, authToken },
      },
      path.join(
        MODS_DIR_PATH,
        `${modsAvailableForUpdate[0].availableVersionForUpdate.file_name}`
      )
    );
    expect(mockDownloadFile).toHaveBeenCalledWith(
      {
        baseURL: options.downloadModsUrl,
        method: 'GET',
        url: modsAvailableForUpdate[1].availableVersionForUpdate.download_url,
        params: { username: options.username, authToken },
      },
      path.join(
        MODS_DIR_PATH,
        `${modsAvailableForUpdate[1].availableVersionForUpdate.file_name}`
      )
    );
  });

  it('should catch errors from downloadFile', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const modsAvailableForUpdate = [
      {
        name: 'mod1',
        availableVersionForUpdate: {
          download_url: 'http://example.com/mod1.zip',
          file_name: 'mod1.zip',
          info_json: { factorio_version: '1.0' },
          released_at: '2022-03-15T12:00:00Z',
          version: '1.1.0',
          sha1: 'abcd1234',
        },
      },
    ];
    const options = {
      downloadModsUrl: 'http://example.com/download',
      username: 'user',
    };
    const authToken = '1234';
    const mockError = new Error('Download error');

    mockDownloadFile.mockRejectedValueOnce(mockError);

    await downloadMods(modsAvailableForUpdate, options, authToken);

    expect(mockDownloadFile).toHaveBeenCalledTimes(1);
    expect(mockDownloadFile).toHaveBeenCalledWith(
      {
        baseURL: options.downloadModsUrl,
        method: 'GET',
        url: modsAvailableForUpdate[0].availableVersionForUpdate.download_url,
        params: { username: options.username, authToken },
      },
      path.join(
        MODS_DIR_PATH,
        `${modsAvailableForUpdate[0].availableVersionForUpdate.file_name}`
      )
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Download mods error!',
      mockError
    );
  });
});
