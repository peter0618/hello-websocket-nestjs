import { generateHash, validateHash } from './crypto.util';

describe('crypto', () => {
  describe('hash function', () => {
    let hash = null;
    const password = '0987qwer';
    it('should make hash', async () => {
      hash = await generateHash(password);
      console.log(hash);
    });

    it('should validate hash', async () => {
      const isValid = await validateHash(password, hash);
      expect(isValid).toBe(true);
    });
  });
});
