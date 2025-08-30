const fs = require('fs');
const path = require('path');

const rootPackage = require('../package.json');

const distPackage = {
  name: rootPackage.name,
  version: rootPackage.version,
  description: rootPackage.description,
  main: 'index.js',
  types: 'index.d.ts',
  author: rootPackage.author,
  license: rootPackage.license,
  dependencies: rootPackage.dependencies,
  peerDependencies: rootPackage.peerDependencies
};

fs.writeFileSync(
  path.join(__dirname, '../dist/package.json'),
  JSON.stringify(distPackage, null, 2)
);