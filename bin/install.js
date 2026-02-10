#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find the project root (where package.json is)
let currentDir = process.cwd();
let projectRoot = currentDir;

// Walk up to find package.json
while (!fs.existsSync(path.join(projectRoot, 'package.json')) && projectRoot !== '/') {
  projectRoot = path.dirname(projectRoot);
}

// If we're being installed as a dependency, go up to the parent project
if (projectRoot.includes('node_modules')) {
  // Go up from node_modules to the actual project
  const parts = projectRoot.split('node_modules');
  projectRoot = parts[0];
}

const targetDir = path.join(projectRoot, '.claude', 'commands');
const sourceFile = path.join(__dirname, '..', '.claude', 'commands', 'validate-wri.md');
const targetFile = path.join(targetDir, 'validate-wri.md');

// Create .claude/commands directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('✅ Created .claude/commands directory');
}

// Copy the command file
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✅ Installed /validate-wri command to .claude/commands/');
  console.log('');
  console.log('🚀 You can now use the command in Claude Code:');
  console.log('   /validate-wri');
  console.log('');
} catch (error) {
  console.error('❌ Failed to install command:', error.message);
  process.exit(1);
}
