#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Detect platform
const platform = os.platform();
let binaryName = 'mark';

if (platform === 'win32') binaryName = 'mark-windows.exe';
if (platform === 'darwin') binaryName = 'mark-macos';

const binaryPath = path.join(__dirname, binaryName);

const child = spawn(binaryPath, process.argv.slice(2), { stdio: 'inherit' });

child.on('close', (code) => {
  process.exit(code || 0);
});
