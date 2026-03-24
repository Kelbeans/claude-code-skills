---
name: reset-rules
description: Remove rules at any level (global or session). Backs up before deleting so you can restore if needed.
---

# Reset Rules Skill - Safe Rule Removal

This skill removes rules from any level (global or session) with automatic backup for safety.

## When to Use This Skill

Use this skill when:
- The user wants to remove rules: "/reset-rules"
- The user wants to start fresh: "/reset-rules --global"
- Custom rules are causing issues
- The user wants to clear temporary session rules

## Quick Start Examples

```bash
# Interactive mode
/reset-rules

# Reset specific level
/reset-rules --global
/reset-rules --session

# Reset everything
/reset-rules --all
```

**Note:** Project rules option removed to prevent creating files in repositories.

## Instructions

### Step 1: Parse Arguments

Check `{{args}}`:
- `--global` -> reset global rules
- `--session` -> reset session rules
- `--project` -> **REJECT** (show error below)
- `--all` -> reset everything
- Empty -> interactive mode

**If user tries --project:**
```
Project rules are no longer supported to avoid creating files in repositories.
Use --global or --session instead.
```

### Step 2: Check Current Status

Use Read tool to check which rules files exist:
- Global: `~/.launchcode/rules/global.md`
- Session: `/tmp/claude-session-rules.md`

Display status:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESET RULES - Remove Custom Rules
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Status:
  Global rules: [Active (N rules) / Not set]
  Session rules: [Active (N rules) / Not set]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no rules exist:
```
No rules are currently active. Nothing to reset.
```

### Step 3: Interactive - Choose Scope

Use AskUserQuestion:
**Question:** "Which rules would you like to reset?"
**Options:**
1. "Global rules" - "Remove all global rules (applies everywhere)"
2. "Session rules" - "Remove temporary session rules"
3. "ALL rules (everything)" - "Nuclear option: remove all rules at all levels"

### Step 4: Show What Will Be Deleted

For specific scope, use Read tool to display current rules:
```
Rules to be removed: [scope]
Location: [file path]

Current rules:
1. [rule 1]
2. [rule 2]
...
```

For `--all`:
```
WARNING: This will delete ALL rules at ALL levels!

Rules that will be removed:
  - Global rules ([N] rules)
  - Session rules ([N] rules)
```

### Step 5: Confirm Reset

Use AskUserQuestion:
**Question:** "Are you sure you want to reset these rules?"
**Options:**
1. "Yes, reset now" - "Remove rules and create backup"
2. "No, cancel" - "Keep existing rules"

### Step 6: Create Backup

Use bash to create backup (silent):
```bash
mkdir -p ~/.launchcode/rules/backups
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
# Copy files to backups/[scope]_[timestamp].md
```

Show: "Backup created in: ~/.launchcode/rules/backups/"

### Step 7: Delete Rules

Use bash to remove files (silent):
```bash
rm -f [file paths]
```

### Step 8: Display Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES RESET SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Scope] rules removed
Claude Code will use default behaviors
Backup saved to: ~/.launchcode/rules/backups/

[If other rules remain:]
Remaining active rules:
  - [List other levels that still have rules]

Next steps:
   /set-rules    - Create new rules
   /view-rules   - See remaining active rules

To restore deleted rules:
   cp ~/.launchcode/rules/backups/[backup-file] [original-location]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Use Read tool** to check/read existing rules
- **Minimal bash usage** - only for backup/delete operations (silent)
- **Don't show bash commands** to user
- **Compose output naturally** - user-friendly messages
- **Safe by default** - requires confirmation
- **Always creates backups** before deleting
- **Show restore instructions** - users can undo if needed
- **Project rules removed** - to prevent creating files in repositories
- `--all` removes rules at both levels (global and session)
- Backups stored in `~/.launchcode/rules/backups/` with timestamps
- Can restore from backups using simple `cp` command
- Reset does not affect default Claude Code behavior - just removes your custom rules
- Use `/view-rules` after reset to see what remains active
