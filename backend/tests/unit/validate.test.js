const { normalizeEmail, isValidEmail, validatePassword, slugify } = require('../../src/utils/validate');

describe('validate utils', () => {
  test('normalizeEmail trims and lowercases', () => {
    expect(normalizeEmail('  Foo@Bar.COM  ')).toBe('foo@bar.com');
  });
  test('isValidEmail', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });
  test('validatePassword rejects weak', () => {
    expect(() => validatePassword('123456')).toThrow();
    expect(() => validatePassword('Password1')).toThrow();
    expect(() => validatePassword('Password1!')).not.toThrow();
  });
  test('slugify', () => {
    expect(slugify('Bici de Prueba')).toBe('bici-de-prueba');
  });
});