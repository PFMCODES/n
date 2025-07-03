
const { exec, path, fs, readline } = require('./exports');
const inquirer = require('inquirer');
const { getGlobalConfig } = require('./global-config');
const { addProject, getUserData } = require('./user-data');

let reinit = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function init(args = []) {
  if (!fs.existsSync(path.join(process.cwd(), 'n.config.json'))) {
    rl.question('Do you want to initialize a new project? (y/n): ', (answer) => {
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
      }
    });
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
    // Auto-initialize with default settings
    const globalConfig = getGlobalConfig();
    const projectName = path.basename(process.cwd());
    
    const configData = {
      ProjectName: projectName,
      ProjectType: globalConfig.defaultProjectType || 'NodeJs',
      build: globalConfig.defaultBuildCommand || "",
      scripts: {
        "test": "node index.js"
      },
      author: globalConfig.author || "",
      version: "1.0.0"
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'n.config.json'), 
      JSON.stringify(configData, null, 2)
    );

    console.log(`Project ${projectName} initialized successfully with defaults!`);
    addProject(projectName, configData.ProjectType);
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
                if (a4.projectType === 'NodeJs') {
                  if (!fs.existsSync(a3)) {
                    fs.mkdirSync(a3);
                  }

                  process.chdir(a3);

                  exec('npm init -y', (error, stdout, stderr) => {
                    if (error) {
                      console.error(`Error: ${error}`);
                      return;
                    }

                    const configData = {
                      ProjectName: a3,
                      ProjectType: a4.projectType,
                      build: "",
                      scripts: {
                        "test": "node index.js"
                      },
                      author: "",
                      version: "1.0.0"
                    };

                    fs.writeFileSync(
                      path.join(process.cwd(), 'n.config.json'), 
                      JSON.stringify(configData, null, 2)
                    );

                    console.log(`Project ${a3} created successfully!`);
                    addProject(a3, a4.projectType);
                  });
                }
              });
            });
          } else {
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
              const configData = {
                ProjectName: path.basename(process.cwd()),
                ProjectType: a4.projectType,
                build: "",
                scripts: {
                  "test": "node index.js"
                },
                author: "",
                version: "1.0.0"
              };

              fs.writeFileSync(
                path.join(process.cwd(), 'n.config.json'), 
                JSON.stringify(configData, null, 2)
              );

              console.log('Project initialized successfully!');
              addProject(path.basename(process.cwd()), a4.projectType);
            });
          }
        });
      } else {
        rl.close();
      }
    });
  }
}

module.exports = { init, initMain };
