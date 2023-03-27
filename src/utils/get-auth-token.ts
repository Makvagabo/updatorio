import axios from 'axios';
import { ProgramOptions } from '../types';

/**
 * Get auth token needed for download mods
 * For more information look at https://wiki.factorio.com/Web_authentication_API
 */
export const getAuthToken = async (options: Pick<ProgramOptions, 'authUrl' | 'username' | 'password'>) => {
  try {
    const {
      data: [token],
    } = await axios<Array<string>>({
      url: options.authUrl,
      method: "POST",
      params: {
        username: options.username,
        password: options.password,
      },
    });

    return token;
  } catch (e) {
    console.error('Get auth token error!', e);

    return '';
  }
};
