# WRI Design System Prototyping Commands

Claude Code commands for building interactive prototypes with the [WRI Design System](https://github.com/wri/wri-design-systems).

## Overview

This repository contains custom Claude Code commands that streamline the process of building, validating, and maintaining prototypes using the WRI Design System. These commands automate best practices, ensure compliance, and accelerate development workflows.

## Commands

### `/setup-wri` - Bootstrap WRI Design System

**Purpose:** Prepare any React project to use the WRI Design System.

**What it does:**
- Detects your project type (Vite, CRA, Next.js, etc.) or helps create a new one
- Installs required dependencies (`@worldresources/wri-design-systems`, Chakra UI, etc.)
- Creates a WRI setup file with theme configuration, helpers, and example components
- Configures your app with `ChakraProvider` using WRI's `designSystemStyles`
- Updates `.claude.json` with WRI Design System mode - instructs Claude to exclusively use WRI components
- Provides links to documentation and type definitions

**When to use:** Run this command at the start of any new project where you want to use the WRI Design System.

**Next steps:** After setup, you can immediately start building prototypes using WRI components, or run `/validate-wri` to check compliance.

---

### `/validate-wri` - Validate & Auto-Fix Compliance

**Purpose:** Audit your codebase for WRI Design System compliance and automatically fix issues.

**What it does:**
- Fetches latest type definitions from GitHub (no local design system repo required)
- Validates component props against type definitions
- Checks for hardcoded colors (should use `getThemedColor()`)
- Flags native HTML elements that should be WRI components
- Detects common mistakes (Modal props, Select props, Badge usage, etc.)
- Identifies opportunities to use pre-built templates
- **Automatically fixes all issues found**

**When to use:**
- Before committing code
- After making significant changes
- When onboarding to the WRI Design System
- Regularly during development to maintain compliance

**Output:** A detailed report of all fixes applied, with file paths and line numbers.

---

### `/validate-quick` - Quick Compliance Check

**Purpose:** Fast validation without auto-fix (view-only mode).

**What it does:**
- Runs the same checks as `/validate-wri`
- Reports issues without making changes
- Useful for quick audits or CI/CD pipelines

**When to use:**
- When you want to see issues before fixing them
- In automated testing workflows
- For compliance reporting

---

### `/fix-wri` - Fix Specific Issues

**Purpose:** Target and fix specific compliance issues.

**What it does:**
- Focuses on particular types of issues (colors, props, templates, etc.)
- Provides more granular control than full auto-fix
- Shows exactly what will change before applying fixes

**When to use:**
- When you want to fix one category of issues at a time
- After reviewing `/validate-quick` results
- For incremental compliance improvements

---

## Installation

### Option 1: Clone this repository

```bash
git clone https://github.com/tth4vb/wri-design-system-prototpying-commands.git
cd wri-design-system-prototpying-commands
```

The `.claude` directory contains all commands and configuration.

### Option 2: Copy commands to your project

Copy the `.claude` directory to your project root:

```bash
cp -r .claude /path/to/your/project/
```

## Usage

### Starting a new project

```bash
# In your project directory
/setup-wri
```

This will bootstrap your project with the WRI Design System and configure Claude Code to use it.

### Validating an existing project

```bash
# Check and auto-fix all compliance issues
/validate-wri

# Or just check without fixing
/validate-quick
```

### Building prototypes

Once setup is complete, Claude Code will automatically:
- Use only WRI Design System components
- Reference type definitions before using components
- Apply proper color theming with `getThemedColor()`
- Follow WRI Design System best practices

Simply describe what you want to build, and Claude will create compliant prototypes.

## How It Works

### WRI Design System Mode

When you run `/setup-wri`, it updates `.claude.json` with a system prompt that instructs Claude Code to:

1. **Exclusively use WRI components** - Never create custom components that duplicate design system functionality
2. **Reference type definitions** - Always check component prop types before using them
3. **Use proper theming** - All colors must use `getThemedColor(palette, shade)`
4. **Follow component patterns** - Use pre-built templates when available
5. **Maintain compliance** - Never use native HTML elements when WRI components exist

This ensures every prototype you build is automatically compliant with the design system.

### Validation & Auto-Fix

The validation commands work without requiring a local copy of the WRI Design System:

1. **Fetch type definitions from GitHub** - Pulls latest component types remotely
2. **Cache definitions locally** - Stores in `/tmp/` for 24 hours to speed up subsequent runs
3. **Validate against source of truth** - Checks your code against actual TypeScript types
4. **Auto-fix issues** - Uses Claude's Edit tool to correct problems automatically
5. **Report changes** - Shows exactly what was fixed and where

## Components Available

The WRI Design System includes 60+ components across these categories:

- **Forms** - Buttons, inputs, controls, tags
- **Containers** - Modals, panels, sheets
- **Navigation** - Navbars, tabs, breadcrumbs, pagination
- **Status** - Badges, toasts, progress indicators
- **Data Display** - Tables, item counts
- **Geospatial** - Layer controls, legends, map markers
- **Icons** - 36 custom WRI icons

See the [Storybook documentation](https://wri.github.io/wri-design-systems/) for full component catalog.

## Resources

- **Storybook:** https://wri.github.io/wri-design-systems/
- **GitHub (Design System):** https://github.com/wri/wri-design-systems
- **Type Definitions:** https://github.com/wri/wri-design-systems/tree/main/src/components
- **Zeroheight Docs:** https://zeroheight.com/4221801da/p/113cd5-wri-uxui-design-system

## Contributing

To add new commands or improve existing ones:

1. Create or edit `.md` files in `.claude/commands/`
2. Test the command in Claude Code
3. Submit a pull request with your changes

## License

MIT

## Support

For issues or questions:
- Open an issue on this repository
- Check the [WRI Design System documentation](https://wri.github.io/wri-design-systems/)
- Review the command files in `.claude/commands/` for detailed instructions
