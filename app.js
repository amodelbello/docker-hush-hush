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

class Hush {
  constructor(secretsDirectory = DEFAULT_SECRETS_DIRECTORY) {
    this.setPath(secretsDirectory);
    this.secrets = {};
  }

  setPath(secretsDirectory) {
    this.secretsDirectory = secretsDirectory;
  }

  getAllSecrets() {
    if (fs.existsSync(this.secretsDirectory)) {
      const files = fs.readdirSync(this.secretsDirectory);

      files.forEach((file) => {
        const fullPath = path.join(this.secretsDirectory, file);
        let data = fs.readFileSync(fullPath, 'utf8')
          .toString()
          .trim()
          .replace(/'/g, '"')
        ;

        if (isJsonLike(data)) {
          data = JSON.parse(data);
        }

        this.secrets[file] = data;

      });
    } 

    return this.secrets;
  }
};

module.exports = new Hush();
