import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

import { makeBackup } from './make-backup';

describe('makeBackup', () => {
  const modsFiles = ['file1.txt', 'file2.txt', 'file3.txt'];

  const options = {
    serverDir: 'server-dir-path',
  };

  const mockJSZipFolder: any = {
    file: jest.fn(),
  };

  const mockJSZipGenerateNodeStreamOn: any = {
    on: jest.fn(),
  };
  const mockJSZipGenerateNodeStreamPipe: any = {
    on: jest.fn(() => mockJSZipGenerateNodeStreamOn),
  };
  const mockJSZipGenerateNodeStream: any = {
    pipe: jest.fn(() => mockJSZipGenerateNodeStreamPipe),
  };

  beforeAll(() => {
    jest.spyOn(fs, 'createWriteStream').mockImplementation(jest.fn());
    jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('content'));
    jest.spyOn(JSZip.prototype, 'folder').mockReturnValue(mockJSZipFolder);
    jest
      .spyOn(JSZip.prototype, 'generateNodeStream')
      .mockReturnValue(mockJSZipGenerateNodeStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should create a zip backup of the mods files', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    makeBackup(modsFiles, options);

    expect(JSZip.prototype.folder).toHaveBeenCalledWith('mods_backup');
    expect(mockJSZipFolder.file).toHaveBeenCalledTimes(modsFiles.length);
    expect(JSZip.prototype.generateNodeStream).toHaveBeenCalledWith({
      type: 'nodebuffer',
      streamFiles: true,
    });
    expect(mockJSZipGenerateNodeStream.pipe).toHaveBeenCalledTimes(1);

    expect(fs.createWriteStream).toHaveBeenCalledWith(
      expect.stringMatching(/^mods_backup_\d+\.\d+\.zip$/)
    );
    expect(mockJSZipGenerateNodeStreamPipe.on).toHaveBeenCalledWith(
      'finish',
      expect.any(Function)
    );
    expect(mockJSZipGenerateNodeStreamOn.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );

    await new Promise((res) => setTimeout(() => res(true), 100));

    mockJSZipGenerateNodeStreamPipe.on.mock.calls[0][1]();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Backup of mods was created success!'
    );
  });

  it('should log an error message and reject if there is an error in the archiving process', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());

    makeBackup(modsFiles, options);

    await new Promise((res) => setTimeout(() => res(true), 100));

    mockJSZipGenerateNodeStreamOn.on.mock.calls[0][1]();

    expect(consoleSpy).toHaveBeenCalledWith(
      'An error has occurred in the backuping mods process!'
    );
  });

  it('should log an error message if there is an error in creating the backup', () => {
    const error = new Error('Error creating backup!')
    jest.spyOn(JSZip.prototype, 'generateNodeStream').mockImplementation(() => {
      throw error;
    });


    return expect(makeBackup(modsFiles, options)).rejects.toEqual(error);
  });
});
