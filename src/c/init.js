const { exec, path, fs, readline } = require('../exports');
const { default: inquirer } = require('inquirer');
const { getUserData } = require('../user-data');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function startCommand(language) {
  return language === 'TypeScript' ? 'ts-node index.ts' : 'node index.js';
}

function langExt(language) {
  return language === 'TypeScript' ? 'ts' : 'js';
}

function init(args = []) {
  const configPath = path.join(process.cwd(), 'n.config.json');

  const proceed = (reinit) => {
    if (args.includes('-y')) {
      initMain(1, reinit);
    } else {
      initMain(0, reinit);
    }
  };

  if (!fs.existsSync(configPath)) {
    rl.question('Do you want to initialize the project? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') proceed(false);
      else rl.close();
    });
  } else {
    rl.question('Do you want to reinitialize the project? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') proceed(true);
      else rl.close();
    });
  }
}

function initMain(autoMode = 0, reinit = false) {
  const user = getUserData() || { name: 'Anonymous', language: 'JavaScript', projectType: 'NodeJs' };
  const extension = langExt(user.language);
  const projectName = path.basename(process.cwd());

  // Create files
  fs.writeFileSync(`index.${extension}`, 'console.log("Hello, World!");');
  fs.writeFileSync('package.json', JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: '',
    main: `index.${extension}`,
    scripts: {
      start: startCommand(user.language),
    },
    author: user.name,
    license: 'ISC',
    dependencies: {},
    devDependencies: {}
  }, null, 2));
  fs.writeFileSync('README.md', `# ${projectName}\n\nThis is a Node.js project created with Nium.`);
  fs.writeFileSync('.gitignore', 'node_modules/\n.DS_Store\n.env\n');
  fs.writeFileSync('n.config.json', JSON.stringify({
    name: projectName,
    projectType: user.projectType,
    version: '1.0.0',
    build: '',
    scripts: {
      start: startCommand(user.language),
    },
    author: user.name
  }, null, 2));

  rl.close();
}

function createProject(projectName, projectType, makeNewFolder, language) {
  if (makeNewFolder === 'y' && !fs.existsSync(projectName)) {
    fs.mkdirSync(projectName);
    process.chdir(projectName);
  }

  const extension = langExt(language);

  fs.writeFileSync(`index.${extension}`, '');
  fs.writeFileSync('package.json', JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: '',
    main: `index.${extension}`,
    scripts: {
      start: startCommand(language),
    },
    author: getUserData()?.name || 'Anonymous',
    license: 'ISC',
    dependencies: {},
    devDependencies: {}
  }, null, 2));
  fs.writeFileSync('README.md', `# ${projectName}\n\nThis is a Node.js project created with Nium.`);
  fs.writeFileSync('.gitignore', 'node_modules/\n.DS_Store\n.env\n');
  fs.writeFileSync('n.config.json', JSON.stringify({
    name: projectName,
    projectType: projectType,
    version: '1.0.0',
    build: '',
    scripts: {
      start: startCommand(language),
    },
    author: getUserData()?.name || 'Anonymous'
  }, null, 2));
}

module.exports = { init, initMain, createProject };