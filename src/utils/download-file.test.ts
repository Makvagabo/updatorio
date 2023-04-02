import fs from 'fs';
import axios from 'axios';
import https from 'https';

import { downloadFile } from './download-file';

jest.mock('axios');

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('downloadFile', () => {
  const outputLocationPath = '/path/to/output/file';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve immediately if file already exists', async () => {
    fs.existsSync = jest.fn().mockReturnValueOnce(true);
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = await downloadFile({}, outputLocationPath);

    expect(fs.existsSync).toHaveBeenCalledWith(outputLocationPath);
    expect(result).toBeUndefined();
    expect(consoleLogSpy).toHaveBeenCalledWith('"file" already exists!');
  });

  it('should download file and resolve', (done) => {
    const requestConfig = { url: 'http://example.com/file' };
    const response = { data: { pipe: jest.fn() } };
    mockedAxios.mockResolvedValueOnce(response);

    const mockOnClose = jest.fn();
    fs.createWriteStream = jest.fn().mockReturnValueOnce({ on: mockOnClose });

    downloadFile(requestConfig, outputLocationPath).then((result) => {
      expect(axios).toHaveBeenCalledWith({
        ...requestConfig,
        httpsAgent: expect.any(https.Agent),
        responseType: 'stream',
      });
      expect(fs.createWriteStream).toHaveBeenCalledWith(outputLocationPath);

      expect(mockOnClose).toHaveBeenCalledTimes(2);
      expect(mockOnClose).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockOnClose).toHaveBeenCalledWith('close', expect.any(Function));

      expect(response.data.pipe).toHaveBeenCalledWith(expect.anything());
      expect(result).toBe(true);

      done();
    });

    setTimeout(() => mockOnClose.mock.calls[1][1](), 0);
  });

  it('should reject if error occur', (done) => {
    const requestConfig = { url: 'http://example.com/file' };
    const response = { data: { pipe: jest.fn() } };
    mockedAxios.mockResolvedValueOnce(response);

    const mockOnClose = jest.fn();
    const mockWriterClose = jest.fn();
    const error = new Error('Disconnect');
    fs.createWriteStream = jest.fn().mockReturnValueOnce({ on: mockOnClose, close: mockWriterClose });

    downloadFile(requestConfig, outputLocationPath).catch((e) => {
      expect(axios).toHaveBeenCalledWith({
        ...requestConfig,
        httpsAgent: expect.any(https.Agent),
        responseType: 'stream',
      });
      expect(fs.createWriteStream).toHaveBeenCalledWith(outputLocationPath);

      expect(mockOnClose).toHaveBeenCalledTimes(2);
      expect(mockOnClose).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockOnClose).toHaveBeenCalledWith('close', expect.any(Function));

      expect(response.data.pipe).toHaveBeenCalledWith(expect.anything());
      expect(mockWriterClose).toHaveBeenCalled();
      expect(e).toBe(error);

      done();
    });

    setTimeout(() => mockOnClose.mock.calls[0][1](error), 0);
  });
});
