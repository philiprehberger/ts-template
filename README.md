# @philiprehberger/template

[![CI](https://github.com/philiprehberger/ts-template/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-template/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/template.svg)](https://www.npmjs.com/package/@philiprehberger/template)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-template)](https://github.com/philiprehberger/ts-template/commits/main)

Lightweight string template engine with safe interpolation, conditionals, and loops.

## Installation

```sh
npm install @philiprehberger/template
```

## Usage

### Basic interpolation

```ts
import { template } from '@philiprehberger/template';

template('Hello {{name}}!', { name: 'World' });
// => "Hello World!"
```

### Dot notation

```ts
import { template } from '@philiprehberger/template';

template('Hello {{user.name}}', { user: { name: 'Alice' } });
// => "Hello Alice"
```

### Conditionals

```ts
import { template } from '@philiprehberger/template';

template('{{#if premium}}Welcome back!{{/if}}', { premium: true });
// => "Welcome back!"

template('{{#unless loggedIn}}Please sign in.{{/unless}}', { loggedIn: false });
// => "Please sign in."
```

### Loops

```ts
import { template } from '@philiprehberger/template';

template('{{#each items}}{{this}}, {{/each}}', { items: ['a', 'b', 'c'] });
// => "a, b, c, "
```

### Filters

```ts
import { template } from '@philiprehberger/template';

template('{{name | upper}}', { name: 'hello' }, {
  filters: { upper: (s) => s.toUpperCase() },
});
// => "HELLO"
```

### Raw output

```ts
import { template } from '@philiprehberger/template';

template('{{{html}}}', { html: '<b>bold</b>' });
// => "<b>bold</b>"
```

### Compile

```ts
import { compile } from '@philiprehberger/template';

const render = compile('Hello {{name}}');
render({ name: 'Alice' }); // => "Hello Alice"
render({ name: 'Bob' });   // => "Hello Bob"
```

## API

### `template(tmpl, data, options?)`

Renders a template string with the given data.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tmpl` | `string` | Template string with `{{expressions}}` |
| `data` | `Record<string, unknown>` | Data object for interpolation |
| `options` | `TemplateOptions` | Optional configuration |

Returns `string`.

### `compile(tmpl, options?)`

Pre-compiles a template for repeated rendering.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tmpl` | `string` | Template string with `{{expressions}}` |
| `options` | `TemplateOptions` | Optional configuration |

Returns `(data: Record<string, unknown>) => string`.

### `TemplateOptions`

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `escape` | `boolean` | `true` | HTML-escape interpolated values |
| `filters` | `Record<string, (value: string) => string>` | `{}` | Named filter functions for pipe syntax |

## Development

```sh
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-template)

🐛 [Report issues](https://github.com/philiprehberger/ts-template/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-template/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
