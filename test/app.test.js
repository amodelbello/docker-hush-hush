const hush = require('../app');

const BASE_PATH             = './test/secrets';
const NONEXISTENT_BASE_PATH = './does/not/exist';

const STRING_FIELD          = 'VAR1';
const ARRAY_FIELD           = 'ARRAY1';
const JSON_FIELD            = 'JSON1';
const NONEXISTENT_FIELD     = 'DOES_NOT_EXIST'

describe('getSecret()', () => {
  beforeEach(() => {
    hush.setBasePath(BASE_PATH);
  });

  test('Retrieves string secret that exists', () => {
    const secret = hush.getSecret(STRING_FIELD);
    expect(secret).toBeTruthy();
    expect(typeof secret).toBe("string");
  });

  test('Retrieves array secret that exists', () => {
    const secret = hush.getSecret(ARRAY_FIELD);
    expect(secret).toBeTruthy();
    expect(secret.constructor).toBe(Array);
  });

  test('Retrieves json secret that exists', () => {
    const secret = hush.getSecret(JSON_FIELD);
    expect(secret).toBeTruthy();
    expect(secret.constructor).toBe(Object);
  });

  test('Handles request for secret that does not exist', () => {
    const secret = hush.getSecret(NONEXISTENT_FIELD);
    expect(secret).toBeNull();
  });
});

describe('getAllSecrets()', () => {
  beforeEach(() => {
    hush.setBasePath(BASE_PATH);
  });

  test('Retrieves all secrets in secrets directory', () => {
    const secrets = hush.getAllSecrets();
    expect(secrets).toBeTruthy();
    expect(secrets.constructor).toBe(Object);
  });

  test('Handles request for secrets from a directory that does not exist', () => {
    hush.setBasePath(NONEXISTENT_BASE_PATH);
    const secrets = hush.getAllSecrets();
    expect(secrets.constructor).toBe(Object);
    expect(secrets).toEqual({});
  });
});