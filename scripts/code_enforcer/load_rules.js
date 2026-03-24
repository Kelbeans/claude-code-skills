#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const globalRulesPath = path.join(process.env.HOME, '.launchcode/rules/global.md');
const sessionRulesPath = '/tmp/claude-session-rules.md';

let rulesOutput = '';
let displayOutput = '';

// Load global rules
if (fs.existsSync(globalRulesPath)) {
  const content = fs.readFileSync(globalRulesPath, 'utf-8');
  displayOutput += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  displayOutput += '📋 Loading Global Rules:\n';
  displayOutput += content;
  displayOutput += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  rulesOutput += content + '\n';
}

// Load session rules
if (fs.existsSync(sessionRulesPath)) {
  const content = fs.readFileSync(sessionRulesPath, 'utf-8');
  displayOutput += '📋 Loading Session Rules:\n';
  displayOutput += content + '\n';
  rulesOutput += content + '\n';
}

// Output for display AND context injection
console.log(displayOutput);
console.log(rulesOutput);
