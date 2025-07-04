const path = require('path');
const fs = require('fs');
const os = require('os');
const { default: inquirer } = require('inquirer');

const folderPath = path.join(os.homedir(), '.nium');
const filePath = path.join(folderPath, 'settings.json');

async function ensureConfigExists() {
  if (!fs.existsSync(filePath)) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Oops! It seems like you are running n(Nium) for the first time. Do you want to create a new config file?',
        default: true,
      },
    ]);

    if (!confirm) return;

    const { name, projectType, language } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Please enter your name:',
        validate: input => input.trim() ? true : 'Name cannot be empty',
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of project are you creating?',
        choices: ['NodeJs', 'React', 'Vue', 'NextJs', 'React Native', 'NPM Module'],
      },
      {
        type: 'list',
        name: 'language',
        message: 'What language are you using?',
        choices: ['JavaScript', 'TypeScript'],
      },
    ]);

    const loader = await import('./loading.mjs');

    loader.start('Creating settings...');
    fs.mkdirSync(folderPath, { recursive: true });

    const settings = { name, projectType, language };
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');

    loader.stop('✅ Configuration created successfully!');
  }
}

module.exports = {
  ensureConfigExists,
  folderPath,
  filePath,
};