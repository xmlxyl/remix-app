const { spawn } = require('child_process');
const path = require('path');

// 指向 React Router 的启动文件
const cliPath = path.join(__dirname, 'node_modules', '@react-router', 'serve', 'dist', 'cli.js');
const buildPath = path.join(__dirname, 'build', 'server', 'index.js');

const child = spawn('node', [cliPath, buildPath], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  console.log(`Process exited with code ${code}`);
});