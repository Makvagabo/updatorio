import { ProgramOptions, SatisfiesModsVersionCondition } from '../types';

export const getSatisfiesModsVersionCondition = (
  versions?: ProgramOptions['semiVersions']
): SatisfiesModsVersionCondition => {
  switch (versions) {
    case 'minor':
    // 📒 WARNING
    // if we want to update the beta version of mods (starts with 0.x.x)
    case 'beta':
      return '^';
    case 'patch':
      return '~';
    default:
      return '';
  }
};
