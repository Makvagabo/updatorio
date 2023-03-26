import { getSatisfiesModsVersionCondition } from './get-satisfies-mods-version-condition';

describe('getSatisfiesModsVersionCondition', () => {
  it.each([
    ['^', 'minor' as const],
    ['^', 'beta' as const],
    ['~', 'patch' as const],
    ['', undefined],
  ])("should return '%s' when given '%s' as input", (expected, input) => {
    expect(getSatisfiesModsVersionCondition(input)).toEqual(expected);
  });
});
