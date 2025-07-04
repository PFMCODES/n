#!/usr/bin/env node

const { fs, exec } = require('./exports');
const { init } = require("./c/init");
const { update } = require('./c/update');
const { run } = require('./c/run');
const { speedTest } = require('./c/speed-test');
const { build } = require('./c/build');
const { filePath, folderPath, ensureConfigExists } = require('./global-config');

async function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case ".": 
    await exec('npm install', (err, stdout, stderr) => {
      if (err) {
        throw err;
      } else {
        console.log(stdout);
      }
    });
    await build();
    break
    case 'speed-test':
      await speedTest();
      break;
    case '--help':
      console.log(`Available commands:
    build
    run
    init
    settings`);
      break;

    case 'run':
       run(args);
       break;

    case 'build':
      await ensureConfigExists();
      build(args);
      break;

    case 'settings':
      await ensureConfigExists();

      if (!fs.existsSync(filePath)) {
        console.error("Config file not found.");
        return;
      }

      try {
        const result = fs.readFileSync(filePath, 'utf-8');
        const settings = JSON.parse(result);
        console.log('Settings');
        console.log(`    Name: ${settings.name}`);
        console.log(`    Project Type: ${settings.projectType}`);
        console.log(`    Language: ${settings.language}`);
        break;
      } catch (err) {
        console.error("Error reading settings:", err.message);
        break;
      }
    case 'update':
      update(args)
      break;
    case 'init':
      await ensureConfigExists();
      init(args);
      break;

    case 'version':
    case '-v':
    case '--version':
      console.log("2.1.4");
      break;

    default:
      console.log(`Unknown command "${command}". Use --help to see available commands.`);
  }
}

main(); // <- run the async main function