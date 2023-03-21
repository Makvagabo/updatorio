import { getUniquePostfix } from './get-unique-postfix';

describe('getUniquePostfix', () => {
  it('should return a string in the format "YYYYMMDD.HHmmsssss"', () => {
    const result = getUniquePostfix();

    expect(result).toMatch(/^\d{8}\.\d{9}$/);
  });

  it('should return a unique value each time it is called', async () => {
    const results = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const result = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(getUniquePostfix());
        }, 10);
      });

      expect(results.has(result)).toBe(false);

      results.add(result);
    }
  });
});
