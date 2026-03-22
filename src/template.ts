import type { TemplateOptions } from './types';

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch]);
}

function getProperty(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;

  // Direct key lookup for special vars like @index and 'this'
  if (path.startsWith('@') || path === 'this') {
    return (obj as Record<string, unknown>)[path];
  }

  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
      return undefined;
    }
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function isTruthy(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

function toString(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

function processBlocks(tmpl: string, data: Record<string, unknown>, options: TemplateOptions): string {
  // Process {{#each key}}...{{/each}}
  tmpl = tmpl.replace(
    /\{\{#each\s+(\w[\w.]*)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_match, key: string, body: string) => {
      const items = getProperty(data, key);
      if (!Array.isArray(items)) return '';
      return items
        .map((item, index) => {
          const itemData: Record<string, unknown> = {
            ...data,
            this: item,
            '@index': index,
          };
          if (typeof item === 'object' && item !== null) {
            Object.assign(itemData, item);
          }
          return render(body, itemData, options);
        })
        .join('');
    },
  );

  // Process {{#if key}}...{{/if}}
  tmpl = tmpl.replace(
    /\{\{#if\s+(\w[\w.]*)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, key: string, body: string) => {
      const value = getProperty(data, key);
      return isTruthy(value) ? render(body, data, options) : '';
    },
  );

  // Process {{#unless key}}...{{/unless}}
  tmpl = tmpl.replace(
    /\{\{#unless\s+(\w[\w.]*)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
    (_match, key: string, body: string) => {
      const value = getProperty(data, key);
      return isTruthy(value) ? '' : render(body, data, options);
    },
  );

  return tmpl;
}

function render(tmpl: string, data: Record<string, unknown>, options: TemplateOptions): string {
  const shouldEscape = options.escape !== false;
  const filters = options.filters ?? {};

  // Process blocks first
  let result = processBlocks(tmpl, data, options);

  // Process raw triple-brace expressions {{{expr}}}
  result = result.replace(/\{\{\{(@?\w[\w.]*)\}\}\}/g, (_match, expr: string) => {
    return toString(getProperty(data, expr));
  });

  // Process escaped double-brace expressions {{expr}} and {{expr | filter}}
  result = result.replace(
    /\{\{(@?\w[\w.]*?)(?:\s*\|\s*(\w+))?\}\}/g,
    (_match, expr: string, filterName?: string) => {
      let value = toString(getProperty(data, expr));

      if (filterName && filters[filterName]) {
        value = filters[filterName](value);
      }

      return shouldEscape ? escapeHtml(value) : value;
    },
  );

  return result;
}

export function template(
  tmpl: string,
  data: Record<string, unknown>,
  options: TemplateOptions = {},
): string {
  return render(tmpl, data, options);
}
