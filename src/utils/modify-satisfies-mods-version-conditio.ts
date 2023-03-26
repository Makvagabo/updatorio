import { Options, SatisfiesModsVersionCondition } from '../types';

const betaMap = {
  '': '' as const,
  '^': '' as const,
  '~': '^' as const,
};

export const modifySatisfiesModsVersionCondition = (
  releaseModVersion: string,
  condition: SatisfiesModsVersionCondition
) => (releaseModVersion.charAt(0) === '0' ? betaMap[condition] : condition);
