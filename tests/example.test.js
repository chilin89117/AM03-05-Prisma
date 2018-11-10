import {getFirst, isPwdValid} from '../src/utils/example';

test('should get 1st name', () => {
  const fname = getFirst('Abbie M.');
  expect(fname).toBe('Abbie');
});

test('should return 1st name for one name', () => {
  const fname = getFirst('Abbie');
  expect(fname).toBe('Abbie');
});

test('should reject pwd length < 8', () => {
  const valid = isPwdValid('abcd');
  expect(valid).toBe(false);
});

test('should reject "password" in password', () => {
  const valid = isPwdValid('abcPassword');
  expect(valid).toBe(false);
});

test('should accept valid password', () => {
  const valid = isPwdValid('abcd1234');
  expect(valid).toBe(true);
});
