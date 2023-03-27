import https from 'https';
import { AxiosRequestConfig } from 'axios';

const httpAgent = new https.Agent({
  rejectUnauthorized: false
});

export const axiosConfigExtender = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return {
    httpAgent,
    ...config,
  }
};
