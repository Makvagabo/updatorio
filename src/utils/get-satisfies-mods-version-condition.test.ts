import { getSatisfiesModsVersionCondition } from './get-satisfies-mods-version-condition';

describe('getSatisfiesModsVersionCondition', () => {
  it.each([
    ['minor' as const, '^'],
    ['patch' as const, '~'],
    [undefined, ''],
  ])("should return '%s' when given '%s' as input", (input, expected) => {
    expect(getSatisfiesModsVersionCondition(input)).toEqual(expected);
  });
});
