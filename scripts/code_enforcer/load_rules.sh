#!/bin/bash

if [ -f ~/.launchcode/rules/global.md ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Loading Global Rules:"
  cat ~/.launchcode/rules/global.md
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  cat ~/.launchcode/rules/global.md
fi

if [ -f /tmp/claude-session-rules.md ]; then
  echo "📋 Loading Session Rules:"
  cat /tmp/claude-session-rules.md
  echo ""
  cat /tmp/claude-session-rules.md
fi
