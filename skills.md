# Code Enforcer

A Claude Code skill suite for managing custom behavioral rules. Define coding standards, style preferences, and behavioral guidelines that Claude Code follows across sessions -- without creating files in your project directories.

---

## Folder Structure

```
code-enforcer/
├── skills.md                          # This file
├── hooks/
│   └── settings.json                  # SessionStart hook configuration
├── scripts/
│   └── code_enforcer/
│       ├── load_rules.js              # Node.js rule loader (primary)
│       └── load_rules.sh              # Bash rule loader (fallback)
└── skills/
    ├── set-rules/
    │   └── SKILL.md                   # Create new rules
    ├── view-rules/
    │   └── SKILL.md                   # Display all active rules
    ├── edit-rules/
    │   └── SKILL.md                   # Modify existing rules
    └── reset-rules/
        └── SKILL.md                   # Remove rules with backup
```

---

## Overview

Code Enforcer provides four slash commands for managing ground rules:

| Command | Description | Skill File |
|---------|-------------|------------|
| `/set-rules` | Create new rules (interactive or quick mode) | [skills/set-rules/SKILL.md](skills/set-rules/SKILL.md) |
| `/view-rules` | Display all active rules from all sources | [skills/view-rules/SKILL.md](skills/view-rules/SKILL.md) |
| `/edit-rules` | Modify, add, delete, or replace existing rules | [skills/edit-rules/SKILL.md](skills/edit-rules/SKILL.md) |
| `/reset-rules` | Remove rules with automatic backup | [skills/reset-rules/SKILL.md](skills/reset-rules/SKILL.md) |

---

## Rule Levels

Rules are stored at two levels with clear priority:

| Level | Scope | Location | Persistence |
|-------|-------|----------|-------------|
| **Global** | All projects and sessions | `~/.launchcode/rules/global.md` | Permanent |
| **Session** | Current session only | `/tmp/claude-session-rules.md` | Temporary |

**Priority:** Session rules override Global rules when there is a conflict.

> **Note:** Project-level rules (`.claude-rules`) are intentionally not supported to avoid creating files in repositories.

---

## How It Works

### 1. Session Start Hook

When a Claude Code session begins, the `SessionStart` hook ([hooks/settings.json](hooks/settings.json)) runs the rule loader script. This reads rule files from disk and injects their contents into the conversation context.

### 2. Rule Loader Scripts

- **[scripts/code_enforcer/load_rules.js](scripts/code_enforcer/load_rules.js)** -- Primary loader (Node.js). Reads global and session rule files, outputs their contents for context injection.
- **[scripts/code_enforcer/load_rules.sh](scripts/code_enforcer/load_rules.sh)** -- Fallback loader (Bash). Same behavior for environments without Node.js.

### 3. Rule Management Skills

Users interact with rules through four slash commands, each backed by its own skill file:

- `/set-rules` -- Create rules from scratch, use templates, or quick-apply via arguments
- `/view-rules` -- See all active rules across all levels with status
- `/edit-rules` -- Add, replace, delete, or modify individual rules
- `/reset-rules` -- Remove rules safely with automatic timestamped backups

---

## Quick Start

```bash
# Create global rules interactively
/set-rules

# Quick-apply rules
/set-rules --global "No unnecessary comments; Prefer TypeScript; Keep responses concise"

# Use a built-in template
/set-rules --template minimal

# View what is active
/view-rules

# Add a rule
/edit-rules --global add "Always validate user input"

# Remove all rules (with backup)
/reset-rules --all
```

---

## Built-in Templates

`/set-rules --template <name>` supports three templates:

### Minimal

Focused on making only requested changes with no extras.

### TypeScript

TypeScript best practices: strict types, functional patterns, async/await.

### Python

PEP 8 compliance, type hints, pytest conventions, pathlib usage.

See [skills/set-rules/SKILL.md](skills/set-rules/SKILL.md) for full template contents.

---

## Backup & Restore

`/reset-rules` always creates a timestamped backup before deleting:

```
~/.launchcode/rules/backups/global_20260324_100000.md
```

To restore:

```bash
cp ~/.launchcode/rules/backups/global_20260324_100000.md ~/.launchcode/rules/global.md
```

---

## Installation

1. Copy the `hooks/settings.json` configuration into your Claude Code settings
2. Place the `scripts/code_enforcer/` directory where `${CLAUDE_PLUGIN_ROOT}` resolves
3. Register the four skills from `skills/` in your Claude Code skill configuration

---

## Rules File Format

All rule files follow this format:

```markdown
# Active Ground Rules

**Scope:** global
**Applied:** 2026-03-24 10:00:00

## Rules

1. First rule
2. Second rule

---
These rules will be consistently followed by Claude Code.
```
