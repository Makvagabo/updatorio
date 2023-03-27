import https from 'https';
import { AxiosRequestConfig } from 'axios';

import { axiosConfigExtender } from './axios-config-extender';

describe('axiosConfigExtender', () => {
  const mockConfig: AxiosRequestConfig = {
    method: 'get',
    url: 'https://example.com',
  };

  it('should return the same config with httpAgent added', () => {
    const result = axiosConfigExtender(mockConfig);
    expect(result).toMatchObject({
      ...mockConfig,
      httpsAgent: expect.any(https.Agent),
    });
  });

  it('should not modify the original config object', () => {
    const result = axiosConfigExtender(mockConfig);
    expect(result).not.toBe(mockConfig);
  });
});
