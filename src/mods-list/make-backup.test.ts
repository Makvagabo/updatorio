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

  const mockJSZipGenerateNodeStreamPipe: any = {
    on: jest.fn(),
  };
  const mockJSZipGenerateNodeStream: any = {
    pipe: jest.fn(() => mockJSZipGenerateNodeStreamPipe),
  };


  beforeAll(() => {
    jest.spyOn(fs, 'createWriteStream').mockImplementation(jest.fn());
    jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('content'));
    jest.spyOn(fs, 'rmSync').mockImplementation(jest.fn());
    jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn());
    jest.spyOn(JSZip.prototype, 'folder').mockReturnValue(mockJSZipFolder);
    jest.spyOn(JSZip.prototype, 'generateNodeStream').mockReturnValue(mockJSZipGenerateNodeStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a zip backup of the mods files and delete the original mods directory', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    makeBackup(modsFiles, options);

    expect(JSZip.prototype.folder).toHaveBeenCalledWith('mods_backup');
    expect(mockJSZipFolder.file).toHaveBeenCalledTimes(modsFiles.length);
    expect(JSZip.prototype.generateNodeStream).toHaveBeenCalledWith({
      type: 'nodebuffer',
      streamFiles: true,
    });
    expect(mockJSZipGenerateNodeStream.pipe).toHaveBeenCalledTimes(1);

    expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringMatching(/^mods_backup_\d+\.\d+\.zip$/));
    expect(mockJSZipGenerateNodeStreamPipe.on).toHaveBeenCalledWith('finish', expect.any(Function));

    mockJSZipGenerateNodeStreamPipe.on.mock.calls[0][1]();

    expect(consoleSpy).toHaveBeenCalledWith('Backup of mods was created success!');
    expect(fs.rmSync).toHaveBeenCalledWith(
      path.join(options.serverDir, 'mods')
    );
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      path.join(options.serverDir, 'mods')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Mods folder was removed!');
  });

  it('should log an error message if there is an error in creating the backup', () => {
    jest.spyOn(JSZip.prototype, 'generateNodeStream').mockImplementation(() => {
      throw new Error('Error creating backup');
    });

    expect(() => makeBackup(modsFiles, options)).toThrowError(
      'Error creating backup'
    );
  });
});
