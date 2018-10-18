const fs   = require('fs');
const path = require('path');

const DEFAULT_SECRETS_DIRECTORY = '/run/secrets';

function isJsonLike(content) {
  try {
    JSON.parse(content);
  } catch (e) {
    return false;
  }
  return true;
}

function isObject(obj) {
  if (obj.constructor !== Object) {
    return false;
  }

  return true;
}

function objectIsEmpty(obj) {
  for (key in obj) {
    return false;
  }

  return true;
}

function formatSecret(pathToSecret) {
  let data;
  try {
    data = fs.readFileSync(pathToSecret, 'utf8')
      .toString()
      .trim()
      .replace(/'/g, '"')
    ;
  } catch (e) {
    data = null;
  }

  if (data && isJsonLike(data)) {
    data = JSON.parse(data);
  }

  Hush.fileAccessed();
  return data;
}

function getFullPath(basePath, file) {
  return path.join(basePath, file);
}

class Hush {
  constructor(secretsDirectory = DEFAULT_SECRETS_DIRECTORY) {
    this.setBasePath(secretsDirectory);
    this.useCache = true;
    this.secrets = {};
  }

  // For unit test spying in conjunction with cache
  static fileAccessed() {
    return true;
  }

  disableCache() {
    this.useCache = false;
  }

  setBasePath(secretsDirectory) {
    this.secretsDirectory = secretsDirectory;
  }

  getSecret(secret) {
    if (this.useCache && this.secrets[secret] !== undefined) {
      return this.secrets[secret];
    }

    const fullPath = getFullPath(this.secretsDirectory, secret);
    this.secrets[secret] = formatSecret(fullPath);

    return this.secrets[secret];
  }

  getAllSecrets() {

    if (!isObject(this.secrets)) {
      return {};
    }

    if (this.useCache && !objectIsEmpty(this.secrets)) {
      return this.secrets;
    }

    if (fs.existsSync(this.secretsDirectory)) {
      const files = fs.readdirSync(this.secretsDirectory);

      files.forEach((file) => {
        const fullPath = getFullPath(this.secretsDirectory, file);
        this.secrets[file] = formatSecret(fullPath);
      });
    } else {
      this.secrets = {};
    }

    return this.secrets;
  }
};

module.exports = new Hush();
