#!/usr/bin/env node
/**
 * Frontend startup script for QuickPoll
 * This script starts the Next.js development server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting QuickPoll Frontend...');
console.log('📱 Next.js development server will be available at: http://localhost:3000');
console.log('🔗 Make sure the backend is running on http://localhost:8000');
console.log('');

// Start Next.js development server
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start Next.js server:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`\n📱 Next.js server exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down frontend server...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down frontend server...');
  nextProcess.kill('SIGTERM');
  process.exit(0);
});
