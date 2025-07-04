const { execSync } = require('child_process');
const fs = require('fs');
const { getUserData } = require('../user-data');
const { default: chalk } = require('chalk'); // assuming chalk v4 is installed

function speedTest() {
  const lang = getUserData().language;

  const command = () => {
    const config = JSON.parse(fs.readFileSync("n.config.json"));
    if (config.scripts && config.scripts['start']) {
      return config.scripts['start'];
    } else if (config.build) {
      return config.build;
    } else {
      if (lang === 'JavaScript') {
        return 'node index.js';
      } else if (lang === 'TypeScript') {
        return 'ts-node index.ts';
      }
    }
  };

  console.log(chalk.blue(`🏁 Starting performance test for ${command()}`));

  const start = process.hrtime();

  try {
    execSync(command(), { stdio: 'inherit' });
  } catch (err) {
    console.error(chalk.red('❌ Error while running your program.'));
    return;
  }

  const diff = process.hrtime(start);
  const timeInMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

  console.log(chalk.green(`🚀 Program executed in ${timeInMs} ms`));
}

module.exports = { speedTest };