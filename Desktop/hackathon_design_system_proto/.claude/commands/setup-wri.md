# Setup WRI Design System

Bootstrap this project with the WRI Design System, making it ready for prototype development.

## Steps

### 1. Detect Project Setup
- Check if `package.json` exists
- If not, ask user if they want to create a new Vite + React + TypeScript project
- Identify framework type (Vite, CRA, Next.js, etc.)

### 2. Check for Existing Chakra Setup
- Scan for existing `ChakraProvider` imports and usage
- If found, warn user that we'll need to replace it with WRI theme
- Check if `@chakra-ui/react` is already installed (might be different version)

### 3. Install Dependencies
Install required packages (check what's already installed first):
```bash
npm install @worldresources/wri-design-systems @chakra-ui/react @emotion/react react react-dom
```

If TypeScript isn't set up:
```bash
npm install -D typescript @types/react @types/react-dom
```

### 4. Create WRI Setup File
Create `src/wri-design-system-setup.tsx` with:
- Export `designSystemStyles` from `@worldresources/wri-design-systems`
- Export `getThemedColor` helper function
- Export an example `<WRIExampleComponent>` showing:
  - Button usage (primary, secondary variants)
  - TextInput with label
  - Modal example
  - Select example
  - Proper color usage with `getThemedColor`
- Add comment block at top with:
  - Link to Storybook: https://wri.github.io/wri-design-systems/
  - Link to GitHub types: https://github.com/wri/wri-design-systems/tree/main/src/components
  - Usage instructions

### 5. Update or Create App.tsx
If `src/App.tsx` exists:
- Check if it has `ChakraProvider` already
- If yes: Update to use `designSystemStyles` from the setup file
- If no: Wrap the app with `ChakraProvider`

If it doesn't exist:
- Create a basic App.tsx that:
  - Imports `ChakraProvider` from `@chakra-ui/react`
  - Imports `designSystemStyles` and `WRIExampleComponent` from setup file
  - Wraps app with ChakraProvider using designSystemStyles
  - Renders the example component

### 6. Configure .claude.json
Update or create `.claude.json` in the project root with the WRI Design System system prompt.

The system prompt should instruct Claude Code to:
- ONLY use components from `@worldresources/wri-design-systems`
- Never create custom components that duplicate design system functionality
- Always use `getThemedColor()` for colors
- Reference type definitions before using components
- Include the full component catalog
- Include workflow and reference locations

Copy the system prompt from the parent directory's `.claude.json` if it exists, otherwise use this structure:

```json
{
  "systemPrompt": "# WRI Design System - Strict Compliance Mode\n\nYou are building interactive prototypes using **exclusively** the WRI Design System.\n\n## Critical Rules\n\n1. **ONLY use components from `@worldresources/wri-design-systems`**...[full prompt]"
}
```

### 7. Add Validation Script (Optional)
Ask the user if they want to add the validation script:
- If yes: Add `"validate": "npx @worldresources/wri-design-systems validate"` to package.json scripts
- Note: Validation can also be run via `/validate-wri` command in Claude Code

### 8. Final Summary
Print a clear summary:
- ✅ Dependencies installed
- ✅ WRI setup file created at `src/wri-design-system-setup.tsx`
- ✅ App.tsx configured with ChakraProvider
- ✅ .claude.json configured for WRI Design System mode
- 📚 Resources:
  - Storybook: https://wri.github.io/wri-design-systems/
  - GitHub: https://github.com/wri/wri-design-systems
- 🚀 Next steps:
  - Review `src/wri-design-system-setup.tsx` for examples
  - Run `/validate-wri` to check compliance
  - Start building with WRI components!

## Important Notes
- Keep it minimal and non-invasive
- Don't assume folder structure - adapt to what exists
- If conflicts detected, explain them clearly and ask user how to proceed
- The setup file is the single source of truth for WRI integration
