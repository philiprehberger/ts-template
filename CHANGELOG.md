# Changelog

## 0.1.2

- Standardize README to 3-badge format with emoji Support section
- Update CI actions to v5 for Node.js 24 compatibility
- Add GitHub issue templates, dependabot config, and PR template

## 0.1.1

- Standardize README badges

## 0.1.0

- Initial release
- `template()` — interpolate string templates with data
- `compile()` — pre-compile templates for repeated rendering
- HTML auto-escaping by default, raw output with triple braces
- Dot notation property access
- Conditional blocks: `{{#if}}...{{/if}}`
- Loop blocks: `{{#each}}...{{/each}}`
- Custom filters: `{{value | filterName}}`
- No eval() — CSP-safe
