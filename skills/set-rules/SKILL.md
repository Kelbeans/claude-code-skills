---
name: set-rules
description: Set custom behavioral rules for Claude Code. Choose between global (all sessions) or session (temporary). No files created in your project directories!
---

# Set Rules Skill - Smart Rule Management

This skill lets you define custom ground rules that Claude Code will follow. Rules can be global (everywhere) or session-based (temporary).

## When to Use This Skill

Use this skill when:
- The user runs: `/set-rules`
- User wants to define coding standards and behavioral guidelines
- Setting up a new project or session

## Quick Start Examples

```bash
# Interactive mode
/set-rules

# Quick apply global rules
/set-rules --global "No unnecessary comments; Prefer TypeScript; Keep responses concise"

# Quick apply session rules
/set-rules --session "Use Redux for state; Follow Material-UI patterns"

# Use a template
/set-rules --template minimal
```

## Why No Project Rules?

**Project rules have been removed** to avoid creating `.claude-rules` files in your repositories. This prevents:
- Accidentally committing tool-specific config to git
- Cluttering project directories with personal preferences
- Potential conflicts with team workflows

**Use instead:**
- **Global rules** for your personal coding standards (applies everywhere)
- **Session rules** for temporary project-specific needs (no files created)

## Instructions

### Step 1: Parse Arguments

Check `{{args}}`:
- `--global [rules]` -> global scope, optional quick rules
- `--session [rules]` -> session scope, optional quick rules
- `--project` -> **REJECT** (show error below)
- `--template [name]` -> apply template
- Empty -> interactive mode

**If user tries --project:**
```
Project rules are no longer supported to avoid creating files in your repository.

Please use instead:
  /set-rules --global   - For personal standards (applies everywhere)
  /set-rules --session  - For temporary project needs (no files created)
```

### Step 2: Interactive - Welcome & Scope

Display welcome:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CODE ENFORCER - Smart Rule Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ground rules control how Claude Code behaves:
  - Coding standards & style preferences
  - Response patterns & communication style
  - File handling preferences
  - Code modification approach

Let's get started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use AskUserQuestion:
**Question:** "Where should these rules apply?"
**Options:**
1. "Global (all projects and sessions)" - "Rules apply everywhere. Saved in ~/.launchcode/rules/global.md (Recommended)"
2. "Session (temporary, this session only)" - "Rules disappear when session ends. No files created in your project."

Set file path:
- Global: `~/.launchcode/rules/global.md`
- Session: `/tmp/claude-session-rules.md`

### Step 3: Check Existing Rules

Use Read tool to check if rules file exists.

If exists, use AskUserQuestion:
**Question:** "Existing rules found. What would you like to do?"
**Options:**
1. "Replace all rules" - "Delete current rules and create new ones"
2. "Add to existing rules" - "Keep current rules and append more"
3. "Cancel" - "Keep current rules unchanged"

### Step 4: Choose Template or Custom

Use AskUserQuestion:
**Question:** "Would you like to start with a template or create custom rules?"
**Options:**
1. "Create custom rules" - "Define your own rules from scratch"
2. "Use 'Minimal' template" - "Minimal changes only, no comments, preserve existing code"
3. "Use 'TypeScript' template" - "TypeScript best practices, strict types, functional patterns"
4. "Use 'Python' template" - "Python PEP8, type hints, pytest conventions"

**Templates:**

**Minimal:**
```
1. Make minimal changes - only what's explicitly requested
2. Do not add unnecessary comments to code
3. Preserve existing code style and formatting
4. Preserve existing comments - do not remove or modify them
5. Do not refactor code unless explicitly asked
6. Do not create files unless explicitly requested
7. Focus only on the specific change requested
8. Do not add "improvements" that weren't asked for
```

**TypeScript:**
```
1. Always use TypeScript for new files
2. Use strict type checking - no 'any' types
3. Prefer functional components with hooks over classes
4. Use async/await over promises
5. Prefer arrow functions and const over function declarations
6. Keep responses concise and technical
```

**Python:**
```
1. Follow PEP 8 style guide strictly
2. Always add type hints to function signatures
3. Use pytest for all tests
4. Prefer dataclasses over regular classes when appropriate
5. Use pathlib for file operations, not os.path
6. Keep docstrings concise - only for public APIs
```

### Step 5: Collect Custom Rules (if not template)

For each rule:
1. Ask: "What is rule #[N]?"
2. **CHECK FOR DUPLICATES**:
   - Read existing rules file (if exists)
   - Compare new rule against all existing rules
   - Look for semantic similarity (keywords, intent, concepts)
   - If similar rule found, ask:
     - "Skip this rule" - Don't add
     - "Replace existing rule" - Remove old, add new
     - "Add anyway" - Keep both

3. Store rule
4. Ask: "Add another rule?" (Yes/No)

### Step 6: Review Rules

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVIEW YOUR RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scope: [global/session]
Will save to: [file path]

1. [First rule]
2. [Second rule]
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use AskUserQuestion:
**Question:** "Apply these rules?"
**Options:**
1. "Yes, apply now" - "Activate these rules"
2. "No, start over" - "Discard and restart"
3. "Cancel" - "Discard and exit"

### Step 7: Create Rules File

Use Write tool to create file with format:
```markdown
# Active Ground Rules

**Scope:** [global/session]
**Applied:** [current date time]

## Rules

1. [First rule]
2. [Second rule]
...

---
These rules will be consistently followed by Claude Code.
```

For global rules, ensure directory exists:
```bash
mkdir -p ~/.launchcode/rules
```

### Step 8: Success Message

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES APPLIED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
   Scope: [scope]
   Rules configured: [count]
   Location: [file path]

Global rules will apply to ALL future sessions!
   Location: ~/.launchcode/rules/global.md
   OR
Session rules will apply until this session ends
   Location: /tmp/claude-session-rules.md (temporary)

Useful commands:
   /view-rules    - See all active rules
   /edit-rules    - Modify your rules
   /reset-rules   - Remove rules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Quick Apply Mode

If user provided rules text in arguments:
1. Parse semicolon-separated rules
2. Number them automatically
3. **Check for duplicates** against existing rules
4. Apply to specified scope
5. Show success message

Example: `/set-rules --global "No comments; Keep minimal"`

## Important Notes

- **Use Read tool** to check/read existing rules
- **Use Write tool** to create rules file
- **Use AskUserQuestion** for all user choices
- **Compose output naturally** - no bash echo commands
- **Duplicate detection is always active**
- **Global rules persist forever** (stored in ~/.launchcode/rules/)
- **Session rules are temporary** (no project files created)
- **Project rules removed** (prevents accidental commits)
- Rules priority: session > global
- Similar rules detected semantically, not just exact matches
- No files ever created in project directories
- Be user-friendly with clear, visual, encouraging messages
