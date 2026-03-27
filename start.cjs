const { spawn } = require('child_process');
const path = require('path');

const cliPath = path.join(__dirname, 'node_modules', '@react-router', 'serve', 'dist', 'cli.js');
const buildPath = path.join(__dirname, 'build', 'server', 'index.js');

const child = spawn(process.execPath, [cliPath, buildPath], {
  stdio: 'inherit',
  shell: false,
});

child.on('error', (err) => {
  console.error('Failed to start process:', err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`Process killed with signal ${signal}`);
    process.exit(1);
  }
  console.log(`Process exited with code ${code}`);
  process.exit(code ?? 1);
});
