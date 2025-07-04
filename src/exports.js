const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const os = require('os');
const loader = require('./loading.mjs');

let nconfig;
if (fs.existsSync(path.join(process.cwd(), 'n.config.json'))) {
  nconfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'n.config.json')));
}

module.exports = { exec, path, fs, readline, nconfig, os, loader }