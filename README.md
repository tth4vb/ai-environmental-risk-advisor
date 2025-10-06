# WRI Design System Validation Commands

Claude Code commands for validating and auto-fixing WRI Design System compliance in any codebase.

## Commands

### `/validate-wri`

Automatically validates and fixes WRI Design System compliance issues in your codebase.

**Features:**
- ✅ Validates component props against official type definitions
- ✅ Detects hardcoded colors and replaces with `getThemedColor()`
- ✅ Identifies wrong component usage (e.g., Badge vs Tag)
- ✅ Checks for proper semantic HTML and ARIA labels
- ✅ Validates Layer Panel patterns
- ✅ **Automatically fixes all issues found**
- ✅ Works on any codebase - fetches type definitions remotely from GitHub

**What it checks:**
1. Component props match TypeScript type definitions
2. Colors use `getThemedColor(palette, shade)`
3. No hardcoded hex/rgb values
4. Native HTML elements that should be WRI components
5. Common mistakes (Modal props, Select props, RadioGroup, etc.)
6. Badge vs Tag component usage
7. Component composition templates (Layer Panel, etc.)
8. Semantic HTML structure and accessibility

## Installation

### Option 1: npm install (Recommended)

```bash
# Install as a dev dependency in your project
npm install --save-dev wri-claude-validation-commands

# Or install globally
npm install -g wri-claude-validation-commands
```

The command will automatically be installed to `.claude/commands/validate-wri.md` in your project during the postinstall step.

### Option 2: Manual Installation

```bash
# Clone this repo
git clone https://github.com/tth4vb/wri-validation-commands.git tmp-commands
cp -r tmp-commands/.claude .
rm -rf tmp-commands
```

## Usage

1. Open your project in Claude Code
2. Run the command:
   ```
   /validate-wri
   ```
3. The validator will:
   - Fetch type definitions from GitHub (or use cached versions)
   - Scan your codebase for WRI Design System usage
   - Identify all compliance issues
   - **Automatically fix all issues**
   - Provide a summary report

## Requirements

- Your project must use `@worldresources/wri-design-systems` package
- Claude Code CLI

## Example Output

```
✅ Issues Fixed

### App.tsx
- Fixed: Hardcoded background color (line 97)
- Fixed: Badge with invalid variant prop → Tag (line 123)

### MapVisualization.tsx
- Fixed: Layer Panel semantic structure (lines 165-187)

Total fixes: 13
```

## No Setup Required!

Unlike other validation tools, this command:
- ✅ Fetches type definitions from GitHub automatically
- ✅ Caches types locally for performance
- ✅ Works on any machine without local WRI repo
- ✅ Auto-fixes issues instead of just reporting them

## Resources

- [WRI Design System Storybook](https://wri.github.io/wri-design-systems/)
- [WRI Design System GitHub](https://github.com/wri/wri-design-systems)
- [Component Type Definitions](https://github.com/wri/wri-design-systems/tree/main/src/components)

## Contributing

Found a bug or want to add more validation rules? Open an issue or submit a PR!

## License

MIT
