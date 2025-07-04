
const { exec, path, fs } = require('../exports');
const { default: inquirer } = require('inquirer');
const { getUserData } = require('../user-data');
const { ensureConfigExists } = require('../global-config');
let startCommand = () => {
  if (getUserData().language === 'JavaScript') {
    return 'node index.js';
  } else if (getUserData().language === 'TypeScript') {
    return 'ts-node index.ts';
  } else {
    return 'node index.js';
  }
};

let reinit = false;

function init(args = []) {
  
  if (!fs.existsSync(path.join(process.cwd(), 'n.config.json'))) {
    inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmInit',
      message: 'Do you want to initialize the project?',
      default: true
    }]).then((answer) => {
      if (answer) {
        reinit = false;
        if (args.includes('-y')) {
          initMain(1);
        } else {
          initMain(0);
        }
      } else {
        return;
      }
    });
  } else {
    inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmInit',
      message: 'Do you want to initialize the project?',
      default: true
    }]).then((answer) => {
      if (answer === 'y') {
        reinit = true;
        if (args.includes('-y')) {
          initMain(1);
        } else {
          initMain(0);
        }
      } else {
        rl.close();
        return;
      }
    });
  }
}

async function initMain(a) {
  if (a == 1) {
    const projectName = process.cwd().split(path.sep).pop();
    const lang = () => { if (getUserData.language === 'JavsScript') { return 'js' } else if (getUserData.language === 'TypeScript') { return 'ts' } else { return 'js' } };
      fs.writeFileSync(`index.${lang()}`, `console.log('Hello, World');`);
      fs.writeFileSync('package.json', JSON.stringify({
        name: process.cwd().split(path.sep).pop(),
        version: '1.0.0',
        description: '',
        main: `index.${lang()}`,
        scripts: {
          start: startCommand(),
        },
        author: getUserData().name,
        license: 'ISC',
        dependencies: {},
        devDependencies: {}
      }, null, 2))
    fs.writeFileSync('README.md', `# ${projectName}\n\nThis is a Node.js project created with Nium.`);
      fs.writeFileSync('.gitignore', 'node_modules/\n.DS_Store\n.env');
      fs.writeFileSync('n.config.json', JSON.stringify({
        name: projectName,
        projectType: getUserData().projectType,
        version: '1.0.0',
        build: "echo \" Building the project...\"",
        scripts: {
          start: startCommand(),
        },
        author: getUserData().name
      }, null, 2))
      await exec('git init', (err, stdout) => {
        if (err) {
          console.error("Error initializing git:", err)
          process.exit(1)
          } else {
            console.log(stdout);
            process.exit(0);
          }
      });
  } else if (a == 0) {
    rl.question('Do you want to make a new folder for it? (y/n): ', (a2) => {
      rl.question('Are you initializing a new project? (y/n): ', (a1) => {
          if (a1 === 'y') {
            if (a2 === 'y') {
              rl.question('Enter the project name: ', (a3) => {
                rl.close();
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'projectType',
                    message: 'What type of project are you creating?',
                    choices: [
                      'NodeJs',
                      'React',
                      'Vue',
                      'NextJs',
                      'React Native',
                      'NPM Module'
                    ]
                  }
                ]).then((a4) => {
                  createProject(a3, a4.projectType, a2, "JavaScript")
                });
              });
            } else {
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'projectType',
                  message: 'What type of project are you creating?',
                  choices: [
                    'NodeJs',
                    'React',
                    'Vue',
                    'NextJs',
                    'React Native',
                    'NPM Module'
                  ]
                }
              ]).then((a4) => {
                createProject(projectName, a4.projectType, a2, "JavaScript");
              });
              rl.close();
            }
          } else {
            rl.close();
          }
        });
      });
    }
  }

function createProject(projectName, projectType, makeNewFolder, language) {
  if (projectType === 'NodeJs') {
    nodejs();
  }
    
  async function nodejs() {
    if (makeNewFolder === 'y') {
      if (!fs.existsSync(projectName)) {
        fs.mkdirSync(projectName);
      }
      process.chdir(projectName);
      const lang = () => { if (language === 'JavsScript') { return 'js' } else if (language === 'TypeScript') { return 'ts' } else { return 'js' } };
      fs.writeFileSync(`index.${lang}`, 'console.log("Hello, World!");');
      fs.writeFileSync('package.json', JSON.stringify({
        name: projectName,
        version: '1.0.0',
        description: '',
        main: `index.${lang()}`,
        scripts: {
          start: startCommand(),
        },
        author: getUserData().name,
        license: 'ISC',
        dependencies: {},
        devDependencies: {}
      }, null, 2))
      fs.writeFileSync('README.md', `# ${projectName}\n\nThis is a Node.js project created with Nium.`);
      fs.writeFileSync('.gitignore', 'node_modules/\n.DS_Store\n.env\n');
      fs.writeFileSync('n.config.json', JSON.stringigfy({
        name: projectName,
        projectType: projectType,
        version: '1.0.0',
        build: "echo \" Building the project...\"",
        scripts: {
          start: startCommand(),
        },
        author: getUserData().name
      }, null, 2))
      await exec('git init');
      process.exit(0);
    }
  }
}

module.exports = { init, initMain, createProject };
