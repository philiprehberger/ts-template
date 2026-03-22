# Changelog

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
