import { Options, SatisfiesModsVersionCondition } from '../types';
import { modifySatisfiesModsVersionCondition } from './modify-satisfies-mods-version-conditio';

describe('modifySatisfiesModsVersionCondition', () => {
  const testCases = [
    ['0.18.0', '', ''],
    ['0.18.0', '^', ''],
    ['0.18.0', '~', '^'],
    ['1.0.0', '', ''],
    ['1.0.0', '^', '^'],
    ['1.0.0', '~', '~'],
  ];

  it.each(testCases)(
    'should return %p when release version is %p and condition is %p',
    (releaseModVersion, condition, expected) => {
      const semiVersion: Options['semiVersions'] = 'beta';

      const result = modifySatisfiesModsVersionCondition(
        releaseModVersion,
        condition as SatisfiesModsVersionCondition,
      );

      expect(result).toBe(expected);
    }
  );
});
