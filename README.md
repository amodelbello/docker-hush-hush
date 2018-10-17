# docker-hush-hush
Node module to retrieve docker secrets

Usage:
```javascript
const hush = require('docker-hush-hush');

// Get all secrets in '/run/secrets' dir
const secrets = hush.getAllSecrets();
console.log(secrets);

// Get single secret in '/run/secrets' dir
const secretName = 'fieldName';
const secret = hush.getSecret(secretName);
console.log(secret);

// Change default dir
hush.setBasePath('./different/path');
```
