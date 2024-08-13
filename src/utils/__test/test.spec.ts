import { nanoid } from 'nanoid';
import { add, prod } from '../test';

describe('test for test files and configuration', () => {
  describe('ts', () => {
    it('should work with TS files', () => {
      expect(prod(3, 4)).toBe(12);
      expect(add(3, 4)).toBe(7);
    });
  });

  describe('esm', () => {
    it('should allow tests import ESM files', () => {
      expect(typeof nanoid()).toBe('string');
    });
  });
});
