const { exec, path, fs, readline, nconfig } = require('./exports');
const { init } = require('./init');
const { incrementBuildCount } = require('./user-data');

function build(args) {
  if(fs.existsSync(path.join(process.cwd(), 'n.config.json'))) {
    if (nconfig.build) {
      console.log(`> ${nconfig.build}`)
      incrementBuildCount();
      exec(nconfig.build)
    }
    else {
      if (fs.existSync(path.join(process.cwd(), 'package.json'))) {
        const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
        if (packageJson.scripts && packageJson.scripts.build) {
          console.log(`> ${packageJson.scripts.build}`)
          exec(packageJson.scripts.build)
        }
      }
      else {
        if (args && args.length > 0) {
          const cleanedArgs = args.map(arg => arg.replace(/['"]/g, ''));
          const command = cleanedArgs.join(' ');
          console.log(`> ${command}`);
          exec(command);
        }
      }
    }
    
  }
  else {
    init()
  }
}

module.exports = { build }