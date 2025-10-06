# WRI Design System Compliance Validation & Auto-Fix

Audit the current file (or all files if none is open) for WRI Design System compliance, then automatically fix all issues found.

This validator works on any codebase - it fetches type definitions remotely from GitHub.

## Setup: Fetch Type Definitions

Before validation, fetch the latest WRI Design System type definitions from GitHub:

1. **Check if types are already cached locally**
   - Look for `/tmp/wri-design-systems-types/` directory
   - If it exists and is less than 24 hours old, use cached version
   - Otherwise, fetch fresh types

2. **Fetch from GitHub (if needed)**
   - Use WebFetch to get raw file contents from: `https://raw.githubusercontent.com/wri/wri-design-systems/main/src/components/[Category]/[Component]/types.ts`
   - For common components, fetch in parallel:
     - `Forms/Actions/Button/types.ts`
     - `Forms/Tag/types.ts`
     - `Forms/Inputs/TextInput/types.ts`
     - `Forms/Inputs/Select/types.ts`
     - `Forms/Controls/Radio/types.ts`
     - `Containers/Modal/types.ts`
     - `Containers/Panel/types.tsx`
     - `Status/Badge/types.ts`
   - Cache fetched types to `/tmp/wri-design-systems-types/` for reuse
   - If WebFetch fails, provide graceful fallback with known common validation rules

## Validation Steps

1. **Read Component Type Definitions**
   - For each WRI component used, fetch its TypeScript types from GitHub or use cached version
   - Parse and extract valid prop names, types, and required props

2. **Check Component Props**
   - Verify all component props match the type definitions
   - Flag any invalid props
   - Flag any missing required props

3. **Check Color Usage**
   - Verify all colors use `getThemedColor(palette, shade)`
   - Flag any hardcoded hex/rgb values
   - Check inline styles: `color`, `backgroundColor`, `borderColor`, etc.

4. **Check HTML Elements**
   - Flag native HTML elements that should be WRI components:
     - `<button>` → should use `<Button>`
     - `<input>` → should use `<TextInput>`, `<Select>`, etc.
     - `<select>` → should use `<Select>`
     - `<textarea>` → should use `<Textarea>`

5. **Check Common Mistakes**
   - Modal: uses `open` not `isOpen`, uses `content` not `children`
   - Select: uses `items` not `options`, uses `defaultValue` not `value`
   - RadioGroup: requires `name` prop
   - ChakraProvider: must use `value={designSystemStyles}`
   - Badge: does NOT support `variant` prop or children - use `Tag` component for status labels with variants (success/warning/error)

6. **Check for Component Composition Templates**
   - Detect common component combinations that have pre-built templates in Storybook
   - Common patterns to check:
     - Panel + TabBar + LayerGroup = should use Layer Panel Template (`Containers/Panel/Templates/Layer Panel`)
     - Panel + Legend components = should use Legend Panel Template
     - Modal + Form inputs = check for Form Modal patterns
   - Flag when manual composition exists but a template is available
   - Check if template stories exist in `[Component].stories.tsx` under Templates

7. **Check for Exported Styled Components**
   - Note: Styled components are NOT exported from the WRI package, so they cannot be imported by consumers
   - Instead, check that inline styles follow the Layer Panel pattern:
     - Use proper semantic HTML: `<aside>`, `<h2>`, `<p>`
     - Include ARIA labels (role="complementary", aria-label on headings)
     - Use consistent theming values matching the design system:
       - Panel header: `padding: '16px 16px 20px 16px'`, `borderBottom: getThemedColor('neutral', 300)`
       - Title: `fontWeight: 700`, `fontSize: '20px'`, `lineHeight: '28px'`, `color: getThemedColor('neutral', 900)`
       - Description: `fontWeight: 400`, `fontSize: '14px'`, `lineHeight: '20px'`, `color: getThemedColor('neutral', 700)`

8. **Validate Semantic Structure**
   - Check if proper semantic elements are used with templates
   - Verify ARIA labels are present where required
   - Check for accessibility attributes (role, aria-label, etc.)

## Auto-Fix Process

After identifying all issues:

1. **Fix Issues Automatically**
   - Use the Edit tool to fix each issue found
   - Fix issues in order: hardcoded colors → invalid props → wrong components → template patterns → styled components
   - For Badge → Tag replacements:
     - Add `Tag` to imports if not present
     - Replace `<Badge variant="X">text</Badge>` with `<Tag variant="X" label="text" />`
     - Remove Badge from imports if no longer used
   - For hardcoded colors:
     - Replace hex values with `getThemedColor(palette, shade)`
   - For Layer Panel patterns:
     - Add proper semantic HTML structure: `<aside>`, `<h2>`, `<p>` with ARIA labels
     - Apply consistent theming values (see step 7 for specifications)
     - Do NOT try to import styled components - they are not exported

2. **Report Changes Made**
   - For each fix, show:
     - ✅ **Fixed:** Brief description
     - **File:** `path/to/file.tsx:lineNumber`
     - **Change:** Before → After

## Final Summary

Provide a summary of all changes:

### ✅ Issues Fixed
- List all fixes made with file paths and line numbers

### 📚 Resources Used
- Link to relevant Storybook pages: `https://wri.github.io/wri-design-systems/?path=/docs/[category]-[component]--docs`
- Link to GitHub type definition files: `https://github.com/wri/wri-design-systems/blob/main/src/components/[Category]/[Component]/types.ts`
- Link to Storybook templates when applicable
- Note: Styled components are internal implementation details and not exported for external use

## Usage Notes

This validator can be run on ANY codebase that uses `@worldresources/wri-design-systems`:

1. Navigate to any project directory
2. Run `/validate-wri`
3. The validator will automatically fetch type definitions from GitHub
4. All issues will be identified and fixed automatically

No local WRI design system repo required!
