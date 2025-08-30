# Create Publishable NestJS Library

A comprehensive guide to creating and publishing a NestJS library with proper configuration and build setup.


## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- NestJS CLI

## Step-by-Step Guide

### Step 1: Create NestJS Project

```bash
nest new explore --package-manager npm --skip-git
```

**What this does:**
- Creates a new NestJS project named `explore`
- Uses npm as package manager
- Skips git initialization

### Step 2: Navigate to Project Directory

```bash
cd nest-logging-lib
```

### Step 3: Remove Main Application Files (Library-Only Setup)

```bash
# Remove main application source
rm -rf src/

# Remove test directory
rm -rf test/
```

### Step 4: Generate Library Using CLI

```bash
nest generate library logging --no-spec
```

**What this does:**
- Creates `libs/logging/` directory
- Sets up basic library structure
- Configures TypeScript
- Generates module and service files

**Expected output structure:**
```
libs/logging/
├── src/
│   ├── index.ts
│   ├── logging.module.ts
│   └── logging.service.ts
├── tsconfig.lib.json
└── package.json (if generated)
```

### Step 5: Update nest-cli.json

```json
{
  "$schema": "https://raw.githubusercontent.com/nestjs/nest-cli/master/lib/schemas/nest-cli.schema.json",
  "collection": "@nestjs/schematics",
  "sourceRoot": "libs/logging/src",
  "compilerOptions": {
    "deleteOutDir": true,
    "tsConfigPath": "libs/logging/tsconfig.lib.json"
  },
  "projects": {
    "logging": {
      "type": "library",
      "root": "libs/logging",
      "entryFile": "index",
      "sourceRoot": "libs/logging/src",
      "compilerOptions": {
        "tsConfigPath": "libs/logging/tsconfig.lib.json"
      }
    }
  }
}
```

### Step 6: Add Build Script

Create `scripts/create-dist-package.js`:

```javascript
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
```

### Step 7: Update Main Package.json

```json
{
  "name": "@explore/common",
  "version": "1.0.0",
  "description": "A basic NestJS logging library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/**/*",
    "README.md"
  ],
  "scripts": {
    "build": "nest build logging && node scripts/create-dist-package.js",
    "copy-package": "copy package.json dist\\package.json",
    "build:prod": "nest build logging --prod && node scripts/create-dist-package.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "prepublishOnly": "npm run build:prod"
  },
  "keywords": [
    "nestjs",
    "logging",
    "logger",
    "typescript"
  ],
  "author": "Mantu Nigam",
  "license": "MIT",
  "peerDependencies": {
    "@nestjs/common": "^9.0.0 || ^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.1",
    "typescript": "^5.1.3"
  }
}
```

### Step 8: Build the Library

```bash
npm run build
```

### Step 9: Local Development Testing with npm link

For local development and testing before publishing, you can use `npm link` to create a symlink to your library.

#### In the Library Project (nestjs-demo-01)

First, build your library and create a global symlink:

```bash
# Build the library first
npm run build

# Create global symlink from the dist directory
cd dist
npm link
cd ..
```

**Alternative approach - Link from root:**
```bash
# Build the library
npm run build

# Link from root (npm will use the "main" field in package.json)
npm link
```

#### In the Consumer Application (explore app)

Navigate to your test application and link to your library:

```bash
# Navigate to your test app directory
cd ../explore

# Link to your local library
npm link @explore/common
```

#### Development Workflow

1. **Make changes** to your library code in `libs/logging/src/`
2. **Rebuild** the library:
   ```bash
   npm run build
   ```
3. **Test immediately** in your linked application without reinstalling

#### Example Usage in Test App

Update your test application's files:

**app.module.ts:**
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from '@explore/common/libs/logging';

@Module({
  imports: [LoggingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**app.controller.ts:**
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingService } from '@explore/common/libs/logging';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  getHello(): string {
    this.loggingService.log('Hello World endpoint called');
    return this.appService.getHello();
  }
}
```

#### Unlinking (Cleanup)

When you're done with local development:

**In the consumer app:**
```bash
npm unlink @explore/common
npm install  # Reinstall normal dependencies
```

**In the library project:**
```bash
npm unlink -g @explore/common
```

#### Troubleshooting npm link

If you encounter issues:

1. **Check global links:**
   ```bash
   npm list -g --depth=0
   ```

2. **Verify link in consumer app:**
   ```bash
   ls -la node_modules/@explore/
   ```

3. **Clear npm cache if needed:**
   ```bash
   npm cache clean --force
   ```

4. **Rebuild and relink:**
   ```bash
   npm run build
   npm unlink -g @explore/common
   npm link
   ```
```

Let me also create a simple script to automate the linking process:

```bash
mkdir -p scripts
```

```javascript:scripts/dev-link.js
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const command = process.argv[2];

function runCommand(cmd, cwd = process.cwd()) {
  console.log(`Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`Error running command: ${cmd}`);
    process.exit(1);
  }
}

function linkLibrary() {
  console.log('🔗 Linking library for local development...');
  
  // Build first
  runCommand('npm run build');
  
  // Link globally
  runCommand('npm link');
  
  console.log('✅ Library linked globally!');
  console.log('Now run "npm link @explore/common" in your test application');
}

function unlinkLibrary() {
  console.log('🔓 Unlinking library...');
  runCommand('npm unlink -g @explore/common');
  console.log('✅ Library unlinked!');
}

function showHelp() {
  console.log(`
Usage: node scripts/dev-link.js [command]

Commands:
  link     - Build and link the library globally
  unlink   - Unlink the library globally
  help     - Show this help message

Examples:
  node scripts/dev-link.js link
  node scripts/dev-link.js unlink
  `);
}

switch (command) {
  case 'link':
    linkLibrary();
    break;
  case 'unlink':
    unlinkLibrary();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.log('Invalid command. Use "help" for usage information.');
    showHelp();
    process.exit(1);
}
```

Now let's update the package.json to include the new dev scripts:

```bash
cat package.json
```

The updated scripts section should include:

```json
{
  "scripts": {
    "build": "nest build logging && node scripts/create-dist-package.js",
    "build:prod": "nest build logging --prod && node scripts/create-dist-package.js",
    "dev:link": "node scripts/dev-link.js link",
    "dev:unlink": "node scripts/dev-link.js unlink",
    "dev:rebuild": "npm run build && echo 'Library rebuilt! Changes available in linked apps.'",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "prepublishOnly": "npm run build:prod"
  }
}
```

## Usage Example

Based on your `app.controller.ts`, here's how to use the logging library:

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingService } from '@explore/common/libs/logging';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly loggingService: LoggingService
  ) {}

  @Get()
  getHello(): any {
    this.loggingService.log('Hello World');
    return this.appService.getHello();
  }
}
```

## Publishing

To publish your library to npm:

```bash
npm publish
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details.