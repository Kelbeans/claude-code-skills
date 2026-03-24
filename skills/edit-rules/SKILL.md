---
name: edit-rules
description: Modify existing rules at any level (global or session). Add new rules or replace entire rule sets.
---

# Edit Rules Skill - Flexible Rule Management

This skill allows you to modify, append, or completely replace rules at any level (global or session).

## When to Use This Skill

Use this skill when:
- The user wants to modify existing rules: "/edit-rules"
- The user wants to add a new rule quickly: "/edit-rules add [rule]"
- The user wants to replace all rules: "/edit-rules replace [rules]"

## Quick Start Examples

```bash
# Interactive mode - asks which rules to edit
/edit-rules

# Quick add to global rules
/edit-rules --global add "Always validate user input"

# Quick add to session rules
/edit-rules --session add "Test-driven development only"

# Replace all session rules
/edit-rules --session replace "No console.logs in commits; Clean code only"
```

**Note:** Project rules removed to prevent creating files in repositories.

## Instructions

### Step 1: Parse Arguments

Check `{{args}}` for:
- Scope: `--global` or `--session`
- Action: `add` or `replace`
- Content: text after action keyword

**If user tries --project:**
```
Project rules are no longer supported to avoid creating files in your repository.
Use --global or --session instead.
```

If no arguments: interactive mode

### Step 2: Interactive - Choose Scope

Use AskUserQuestion:

**Question:** "Which rules would you like to edit?"
**Header:** "Rule Level"
**Options:**
1. "Global rules" - "Edit rules that apply everywhere"
2. "Session rules" - "Edit temporary session rules"

Set file path accordingly:
- Global: `~/.launchcode/rules/global.md`
- Session: `/tmp/claude-session-rules.md`

### Step 3: Check if Rules Exist

Use Read tool to check if rules file exists.

If doesn't exist, use AskUserQuestion:

**Question:** "No existing rules. What would you like to do?"
**Header:** "No Rules"
**Options:**
1. "Create new rules" - "Set up new rules from scratch"
2. "Cancel" - "Exit without changes"

If "Create new rules", suggest: "Use `/set-rules --[scope]` to create rules interactively."

### Step 4: Show Current Rules

Use Read tool to read the rules file.

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT [SCOPE] RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. [First rule]
2. [Second rule]
3. [Third rule]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Extract just the numbered rules (lines starting with `1.`, `2.`, etc.)

### Step 5: Interactive - Choose Action

Use AskUserQuestion:

**Question:** "What would you like to do?"
**Header:** "Action"
**Options:**
1. "Add a new rule" - "Append a new rule to existing ones"
2. "Replace all rules" - "Delete current rules and create new ones"
3. "Delete a specific rule" - "Remove one rule by number"
4. "Edit a specific rule" - "Modify an existing rule"
5. "Cancel" - "Exit without changes"

### Step 6: Handle "Add" Action

1. If quick mode: use provided text
2. If interactive: ask "What rule would you like to add?"
3. **Check for duplicates** (use same logic as set-rules)
4. Find highest rule number
5. Add new rule with next number
6. Use Edit tool to insert before `---` line
7. Show success: "Rule added: [N]. [text]"

### Step 7: Handle "Replace" Action

1. If quick mode: parse semicolon-separated rules
2. If interactive: collect new rules one by one
3. **Check for duplicates** for each new rule
4. Use Write tool to replace entire file with new rules
5. Show success: "All rules replaced"

### Step 8: Handle "Delete" Action

1. Show numbered rules again
2. Ask: "Which rule number to delete?"
3. Use Edit tool to remove that line
4. Renumber remaining rules
5. Show success: "Rule deleted and renumbered"

### Step 9: Handle "Edit" Action

1. Ask: "Which rule number to edit?"
2. Show current rule text
3. Ask: "Enter new text for this rule"
4. **Check for duplicates** against other rules
5. Use Edit tool to replace
6. Show success: "Rule updated"

### Step 10: Show Updated Rules

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPDATED [SCOPE] RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[List all current rules]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use '/view-rules' to see all active rules
```

## Important Notes

- **Use Read tool** to read existing rules - clean and simple
- **Use Edit tool** for modifications - precise changes
- **Use Write tool** for replacements - create new content
- **Compose output naturally** - don't echo bash commands
- **Be user-friendly** - clear messages and confirmations
- **No bash commands visible** to user - just results
- **Project rules removed** - to prevent creating files in repositories
- **Duplicate detection active** - prevents adding redundant rules
- Only modifies global or session rules (no project files)
