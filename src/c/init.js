
const { exec, path, fs, readline } = require('../exports');
const { default: inquirer } = require('inquirer');
const { getUserData } = require('../user-data');
let startCommand = () => {
  if (language === 'JavaScript') {
    return 'node index.js';
  } else if (language === 'TypeScript') {
    return 'ts-node index.ts';
  } else {
    return 'node index.js';
  }
};

let reinit = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function init(args = []) {
  if (!fs.existsSync(path.join(process.cwd(), 'n.config.json'))) {
    if (answer === 'y') {
      reinit = false;
      if (args.includes('-y')) {
        initMain(1);
      } else {
        initMain(0);
      }
    } else if (answer === 'n') {
      rl.close();
      return;
    };
  } else {
    rl.question('Do you want to reinitialize the project? (y/n): ', (answer) => {
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

function initMain(a) {
  if (a == 1) {
    

    console.log(`Project ${projectName} initialized successfully with defaults!`);
  } else if (a == 0) {
    rl.question('Are you initializing a new project? (y/n): ', (a1) => {
      if (a1 === 'y') {
        rl.question('Do you want to make a new folder for it? (y/n): ', (a2) => {
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
                  createProject(a3, a4.projectType, a2, reinit, "JavaScript")
              });
            });
          } else {
            
          }
        });
      } else {
        rl.close();
      }
    });
  }
}

function createProject(projectName, projectType, makeNewFolder, reinit, language) {
  if (projectType === 'NodeJs') {
    nodejs();
  }
    
  function nodejs() {
    if (makeNewFolder === 'y') {
      if (!fs.existsSync(projectName)) {
        fs.mkdirSync(projectName);
      }
      process.chdir(projectName);
      const lang = () => { if (language === 'JavsScript') { return 'js' } else if (language === 'TypeScript') { return 'ts' } else { return 'js' } };
      fs.writeFileSync(`index.${lang}`)
      fs.writeFileSync('n.config.json', JSON.stringigfy({
        name: projectName,
        projectType: projectType,
        build: '',
        scripts: {
          start: startCommand(),
        },
        author: getUserData().name,
        version: '1.0.0',
      }, null, 2))
    }
  }
}

module.exports = { init, initMain, createProject };
