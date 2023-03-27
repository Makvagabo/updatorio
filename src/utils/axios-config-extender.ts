import https from 'https';
import { AxiosRequestConfig } from 'axios';

const agent = new https.Agent({
  rejectUnauthorized: false
});

export const axiosConfigExtender = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return {
    httpsAgent: agent,
    ...config,
  }
};
