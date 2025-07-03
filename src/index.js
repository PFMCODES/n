#!/usr/bin/env node
const [, , command, ...args] = process.argv;
switch (command) {
  case '--help':
    console.log(`Available commands:
                  run
                  build
                  user
                  projects
                  stats\n`)
    break;
  case 'run':
    const run = require('./c/run');
    run(args);
    break;
  case 'build':
    const { build } = require('./c/build')
    build(args);
    break;
  case 'user':
    const { getUserData, setUserData } = require('./c/user-data');
    if (args[0] === 'set' && args[1] && args[2]) {
      setUserData(args[1], args[2]);
      console.log(`Set ${args[1]} to ${args[2]}`);
    } else if (args[0] === 'get' && args[1]) {
      const userData = getUserData();
      console.log(JSON.stringify(userData, null, 2));
    } else {
      console.log('Usage: user set <key> <value> | user get');
    }
    break;
  case 'projects':
    const { getUserProjects } = require('./c/user-data');
    const projects = getUserProjects();
    console.log('Your projects:');
    projects.forEach(project => {
      console.log(`- ${project.name} (${project.type}) at ${project.path}`);
    });
    break;
  case 'stats':
    const { getUserStats } = require('./c/user-data');
    const stats = getUserStats();
    console.log('Your stats:');
    console.log(`Projects created: ${stats.projectsCreated}`);
    console.log(`Builds run: ${stats.buildsRun}`);
    console.log(`Last activity: ${stats.lastActivity || 'Never'}`);
    break;
  case 'init': 
    const { init } = require("./c/init")
    init(args)
      break;
}