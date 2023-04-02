import axios from 'axios';
import https from 'https';

import { getAuthToken } from './get-auth-token';

jest.mock('axios');

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('getAuthToken', () => {
  const authUrl = 'https://test.com/auth';
  const username = 'testuser';
  const password = 'testpassword';
  const token = 'testtoken';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid auth token', async () => {
    const expectedRequestBody = { username, password };

    mockedAxios.mockResolvedValueOnce({ data: [token] });

    const result = await getAuthToken({ authUrl, username, password });

    expect(result).toBe(token);
    expect(mockedAxios).toHaveBeenCalledTimes(1);
    expect(mockedAxios).toHaveBeenCalledWith({
      url: authUrl,
      method: 'POST',
      params: expectedRequestBody,
      httpsAgent: expect.any(https.Agent),
    });
  });

  it('should return an empty string if the request fails', async () => {
    const error = new Error('Failed to authenticate');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockedAxios.mockRejectedValueOnce(error);

    await expect(getAuthToken({ authUrl, username, password })).rejects.toThrow(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Get auth token error!');
  });
});
