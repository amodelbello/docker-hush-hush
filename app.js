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

  return data;
}

function getFullPath(basePath, file) {
  return path.join(basePath, file);
}

class Hush {
  constructor(secretsDirectory = DEFAULT_SECRETS_DIRECTORY) {
    this.setBasePath(secretsDirectory);
    this.secrets = {};
  }

  setBasePath(secretsDirectory) {
    this.secretsDirectory = secretsDirectory;
  }

  getSecret(secret) {
    const fullPath = getFullPath(this.secretsDirectory, secret);
    const data = formatSecret(fullPath);

    return data;
  }

  getAllSecrets() {
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
