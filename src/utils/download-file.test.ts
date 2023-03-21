import fs from 'fs';
import axios from 'axios';

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

  it('should download file and resolve', async () => {
    const requestConfig = { url: 'http://example.com/file' };
    const response = { data: { pipe: jest.fn() } };
    mockedAxios.mockResolvedValueOnce(response);
    fs.createWriteStream = jest.fn().mockReturnValueOnce({ on: jest.fn() });

    downloadFile(requestConfig, outputLocationPath);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(axios).toHaveBeenCalledWith({
      ...requestConfig,
      responseType: 'stream',
    });
    expect(fs.createWriteStream).toHaveBeenCalledWith(outputLocationPath);
    expect(response.data.pipe).toHaveBeenCalledWith(expect.anything());
  });
});
