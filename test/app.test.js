const hush = require('../app');
const BASE_PATH             = './test/secrets';
const NONEXISTENT_BASE_PATH = './does/not/exist';

const STRING_FIELD          = 'VAR1';
const ARRAY_FIELD           = 'ARRAY1';
const JSON_FIELD            = 'JSON1';
const NONEXISTENT_FIELD     = 'DOES_NOT_EXIST'

describe('getSecret()', () => {

  let fileAccessed;

  beforeEach(() => {
    hush.secrets = {};
    hush.setBasePath(BASE_PATH);
    fileAccessed = jest.spyOn(hush.constructor, 'fileAccessed');
  });

  afterEach(() => {
    fileAccessed.mockClear();
  });

  test('Retrieves string secret that exists', () => {
    const secret = hush.getSecret(STRING_FIELD);
    expect(secret).toBeTruthy();
    expect(typeof secret).toBe("string");

    const cachedSecret = hush.getSecret(STRING_FIELD);
    expect(cachedSecret).toBeTruthy();
    expect(typeof cachedSecret).toBe("string");

    expect(fileAccessed).toHaveBeenCalledTimes(1);
  });

  test('Retrieves array secret that exists', () => {
    const secret = hush.getSecret(ARRAY_FIELD);
    expect(secret).toBeTruthy();
    expect(secret.constructor).toBe(Array);
    
    const cachedSecret = hush.getSecret(ARRAY_FIELD);
    expect(cachedSecret).toBeTruthy();
    expect(cachedSecret.constructor).toBe(Array);

    expect(fileAccessed).toHaveBeenCalledTimes(1);
  });

  test('Retrieves json secret that exists', () => {
    const secret = hush.getSecret(JSON_FIELD);
    expect(secret).toBeTruthy();
    expect(secret.constructor).toBe(Object);

    const cachedSecret = hush.getSecret(JSON_FIELD);
    expect(cachedSecret).toBeTruthy();
    expect(cachedSecret.constructor).toBe(Object);

    expect(fileAccessed).toHaveBeenCalledTimes(1);
  });

  test('Handles request for secret that does not exist', () => {
    const secret = hush.getSecret(NONEXISTENT_FIELD);
    expect(secret).toBeNull();
  });
});

describe('getAllSecrets()', () => {
  let fileAccessed;

  beforeEach(() => {
    hush.secrets = {};
    hush.setBasePath(BASE_PATH);
    fileAccessed = jest.spyOn(hush.constructor, 'fileAccessed');
  });

  afterEach(() => {
    fileAccessed.mockClear();
  });

  test('Retrieves all secrets in secrets directory', () => {
    const secrets = hush.getAllSecrets();
    expect(secrets).toBeTruthy();
    expect(secrets.constructor).toBe(Object);

    const cachedSecrets = hush.getAllSecrets();
    expect(cachedSecrets).toBeTruthy();
    expect(cachedSecrets.constructor).toBe(Object);

    expect(fileAccessed).toHaveBeenCalledTimes(3);
  });

  test('Handles request for secrets from a directory that does not exist', () => {
    hush.setBasePath(NONEXISTENT_BASE_PATH);
    const secrets = hush.getAllSecrets();
    expect(secrets.constructor).toBe(Object);
    expect(secrets).toEqual({});
  });

  test('Handles request for secrets when secrets is not an object', () => {
    hush.setBasePath(NONEXISTENT_BASE_PATH);
    hush.secrets = 4;
    const secrets = hush.getAllSecrets();
    expect(secrets.constructor).toBe(Object);
    expect(secrets).toEqual({});
  });
});

describe('Gets secrets with the cache off', () => {
  let fileAccessed;

  beforeEach(() => {
    hush.secrets = {};
    hush.setBasePath(BASE_PATH);
    fileAccessed = jest.spyOn(hush.constructor, 'fileAccessed');

    hush.disableCache();
  });

  afterEach(() => {
    fileAccessed.mockClear();
  });

  test('Retrieves string secret that exists with the cache off', () => {
    const secret = hush.getSecret(STRING_FIELD);
    expect(secret).toBeTruthy();
    expect(typeof secret).toBe("string");

    const cachedSecret = hush.getSecret(STRING_FIELD);
    expect(cachedSecret).toBeTruthy();
    expect(typeof cachedSecret).toBe("string");

    expect(fileAccessed).toHaveBeenCalledTimes(2);
  });

  test('Retrieves all secrets in secrets directory with the cache off', () => {
    const secrets = hush.getAllSecrets();
    expect(secrets).toBeTruthy();
    expect(secrets.constructor).toBe(Object);

    const cachedSecrets = hush.getAllSecrets();
    expect(cachedSecrets).toBeTruthy();
    expect(cachedSecrets.constructor).toBe(Object);

    expect(fileAccessed).toHaveBeenCalledTimes(6);
  });
});