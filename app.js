const fs   = require('fs');
const path = require('path');

const DEFAULT_SECRETS_DIRECTORY = '/run/secrets';

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

      files.forEach((file, index) => {
        const fullPath = path.join(this.secretsDirectory, file);
        const key = file;
        const data = fs.readFileSync(fullPath, 'utf8').toString().trim();

        this.secrets[key] = data;
      });

      return this.secrets;
    }
  }
};

module.exports = new Hush();
