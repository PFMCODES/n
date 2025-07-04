const { exec } = require('../exports');

function update(args) {
    exec('npm i -g nium@' + args[0], (err, stdout, stderr) => {
        if (err) {
            console.error("Error during update:", err);
            process.exit(1);
        } else {
            console.log(stdout);
            if (stderr) console.error(stderr);
            console.log("Nium has been updated successfully!");
            process.exit(0);
        }
    });
}

module.exports = { update };