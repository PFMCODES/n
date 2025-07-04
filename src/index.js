#!/usr/bin/env node

const { fs, exec } = require('./exports');
const { init } = require("./c/init");
const { run } = require('./c/run');
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
    case 'init':
      await ensureConfigExists();
      init(args);
      break;

    default:
      console.log(`Unknown command "${command}". Use --help to see available commands.`);
  }
}

main(); // <- run the async main function