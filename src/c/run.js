const { fs, path, exec } = require('../exports');
const { default: inquirer } = require('inquirer');

function run(args) {
    const configPath = path.join(process.cwd(), 'n.config.json');
    
    if (!fs.existsSync(configPath)) {
        console.error('❌ No configuration file found. Please run "nium init" first.');
        return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    if (args.length === 0) {
        console.error('❌ No script specified. Please provide a script name from n.config.json.');
        return;
    }

    if (args.includes('--help')) {
        console.log(`📘 Usage: nium run [script from n.config.json]`);
        console.log(`Available scripts: ${Object.keys(config.scripts).join(', ')}`);
        return;
    }

    const scriptName = args[0];
    const scriptCommand = config.scripts?.[scriptName];

    if (!scriptCommand) {
        console.error(`❌ Script "${scriptName}" not found in n.config.json.`);
        return;
    }

    console.log(`> ${scriptCommand}\n`);
    exec(scriptCommand, (err, stdout, stderr) => {
        if (err) {
            console.error("Execution error:", err);
            process.exit(1);
        } else {
            console.log(stdout);
            if (stderr) console.error(stderr);
            process.exit(1);
        }
    });
}

module.exports = { run };