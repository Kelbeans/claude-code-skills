---
name: view-rules
description: Display all active rules from all sources (global, session). See exactly which rules Claude Code is following right now.
---

# View Rules Skill - Complete Rule Visibility

This skill displays ALL active rules that Claude Code is currently following, showing the complete rule hierarchy from all sources.

## When to Use This Skill

Use this skill when:
- The user asks: "what rules are active?", "show rules", "/view-rules"
- You want to verify which rules are currently being applied
- You need to understand the current behavioral configuration

## How Rules Are Applied

Rules are loaded in this priority order (later overrides earlier):

1. Global Rules (~/.launchcode/rules/global.md)
2. Session Rules (/tmp/claude-session-rules.md)

**Note:** Project rules (.claude-rules) have been removed to avoid creating files in your repositories.

## Instructions

### Step 1: Check Which Rule Files Exist

Silently check which rule files exist. Use these file paths:
- Global: `~/.launchcode/rules/global.md`
- Session: `/tmp/claude-session-rules.md`

Use the Read tool to read files that exist. Don't show file contents directly - you'll format them nicely.

**Do NOT check for .claude-rules** - project rules have been removed.

### Step 2: Display Clean Output to User

Compose a clean, formatted output showing:

**Header:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVE RULES - Complete Overview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**For each rule level (Global, Session):**

If file exists:
- Show title (e.g., "GLOBAL RULES (All Projects & Sessions)")
- Extract the rules (lines that start with numbers like "1.", "2.", etc.)
- Display each rule cleanly
- Show when rules were applied (look for "Applied:" line in file)
- Add separator line

If file doesn't exist:
- Show "Not set"
- Suggest command to set rules (e.g., "Use '/set-rules --global' to set global rules")

**Summary Section:**

If any rules exist:
- Count total rules across all files
- Show priority reminder: "Session > Global"
- Note: "Project rules disabled (no files created in repos)"

If no rules exist:
- Show "NO RULES CONFIGURED"
- Explain default behavior
- Suggest getting started with /set-rules

**Footer:**
- List useful commands: /edit-rules, /reset-rules, /set-rules

### Step 3: Handle Arguments (Optional)

If user provides `--compact` argument:
- Show a condensed view with just rule numbers and text
- Skip locations and timestamps

If user provides `--full` argument:
- Show complete file contents without formatting

## Output Format Example

When rules exist:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVE RULES - Complete Overview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GLOBAL RULES (All Projects & Sessions)

   1. Keep responses concise and technical
   2. No unnecessary comments in code
   3. Preserve existing code style

   Applied: 2026-01-20 17:30:00

───────────────────────────────────────────────────

SESSION RULES: Not set
   Use '/set-rules --session' for temporary rules

───────────────────────────────────────────────────

SUMMARY
   Total active rules: 3
   Priority: Session > Global
   Note: Project rules disabled (no files created in repos)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Useful commands:
   /edit-rules   - Modify existing rules
   /reset-rules  - Remove rules
   /set-rules    - Add new rules
```

## Important Notes

- **Don't show bash commands to the user** - just show the formatted output
- **Use Read tool** to read files - it's cleaner than bash cat/grep
- **Compose output naturally** - don't echo pre-formatted strings from bash
- **Extract rules intelligently** - look for lines starting with numbers
- **Be user-friendly** - clean, visual, easy to understand
- **Handle missing files gracefully** - show helpful suggestions
- **Do NOT check for .claude-rules** - project rules have been removed
- Shows rules from both global and session levels only
- Clear visual distinction between global/session
- Explains inheritance (session overrides global)
- Provides helpful next steps if no rules exist
- Project rules removed to prevent creating files in repositories
