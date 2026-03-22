import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { template, compile } from '../../dist/index.js';

describe('template', () => {
  describe('basic interpolation', () => {
    it('replaces a single variable', () => {
      assert.equal(template('Hello {{name}}', { name: 'World' }), 'Hello World');
    });

    it('returns empty string for missing values', () => {
      assert.equal(template('Hello {{name}}', {}), 'Hello ');
    });

    it('replaces multiple variables', () => {
      assert.equal(template('{{a}} and {{b}}', { a: 'X', b: 'Y' }), 'X and Y');
    });
  });

  describe('dot notation', () => {
    it('accesses nested properties', () => {
      assert.equal(template('{{user.name}}', { user: { name: 'Alice' } }), 'Alice');
    });

    it('accesses deeply nested properties', () => {
      assert.equal(template('{{a.b.c}}', { a: { b: { c: 'deep' } } }), 'deep');
    });

    it('returns empty string for missing nested properties', () => {
      assert.equal(template('{{a.b.c}}', { a: {} }), '');
    });
  });

  describe('HTML escaping', () => {
    it('escapes HTML entities by default', () => {
      assert.equal(
        template('{{html}}', { html: "<script>alert('xss')</script>" }),
        '&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;',
      );
    });

    it('escapes all special characters', () => {
      assert.equal(template('{{v}}', { v: '&<>"\'' }), '&amp;&lt;&gt;&quot;&#39;');
    });

    it('disables escaping with escape: false', () => {
      assert.equal(
        template('{{html}}', { html: '<b>bold</b>' }, { escape: false }),
        '<b>bold</b>',
      );
    });
  });

  describe('raw output', () => {
    it('does not escape triple-brace expressions', () => {
      assert.equal(template('{{{html}}}', { html: '<b>bold</b>' }), '<b>bold</b>');
    });
  });

  describe('filters', () => {
    it('applies a filter to the value', () => {
      assert.equal(
        template('{{name | upper}}', { name: 'hello' }, { filters: { upper: (s) => s.toUpperCase() } }),
        'HELLO',
      );
    });
  });

  describe('conditionals', () => {
    it('renders block when condition is truthy', () => {
      assert.equal(template('{{#if show}}yes{{/if}}', { show: true }), 'yes');
    });

    it('hides block when condition is false', () => {
      assert.equal(template('{{#if show}}yes{{/if}}', { show: false }), '');
    });

    it('hides block when condition is undefined', () => {
      assert.equal(template('{{#if show}}yes{{/if}}', {}), '');
    });

    it('treats empty array as falsy', () => {
      assert.equal(template('{{#if items}}yes{{/if}}', { items: [] }), '');
    });

    it('renders unless block when condition is falsy', () => {
      assert.equal(template('{{#unless hide}}shown{{/unless}}', { hide: false }), 'shown');
    });

    it('hides unless block when condition is truthy', () => {
      assert.equal(template('{{#unless hide}}shown{{/unless}}', { hide: true }), '');
    });
  });

  describe('each loops', () => {
    it('iterates over array with {{this}}', () => {
      assert.equal(
        template('{{#each items}}{{this}},{{/each}}', { items: ['a', 'b', 'c'] }),
        'a,b,c,',
      );
    });

    it('iterates over array of objects', () => {
      assert.equal(
        template('{{#each items}}{{name}}{{/each}}', { items: [{ name: 'A' }, { name: 'B' }] }),
        'AB',
      );
    });

    it('provides @index in each block', () => {
      assert.equal(
        template('{{#each items}}{{@index}}{{/each}}', { items: ['a', 'b'] }),
        '01',
      );
    });

    it('returns empty string for empty array', () => {
      assert.equal(template('{{#each items}}{{this}}{{/each}}', { items: [] }), '');
    });

    it('returns empty string for missing key', () => {
      assert.equal(template('{{#each items}}{{this}}{{/each}}', {}), '');
    });
  });

  describe('compile', () => {
    it('returns a reusable render function', () => {
      const render = compile('Hello {{name}}');
      assert.equal(render({ name: 'A' }), 'Hello A');
    });

    it('can be called multiple times with different data', () => {
      const render = compile('Hi {{name}}');
      assert.equal(render({ name: 'Alice' }), 'Hi Alice');
      assert.equal(render({ name: 'Bob' }), 'Hi Bob');
    });
  });

  describe('security', () => {
    it('blocks __proto__ access', () => {
      assert.equal(template('{{__proto__}}', { __proto__: 'evil' }), '');
    });

    it('blocks constructor access', () => {
      assert.equal(template('{{constructor}}', {}), '');
    });

    it('blocks prototype in dot notation', () => {
      assert.equal(template('{{a.__proto__.b}}', { a: {} }), '');
    });
  });
});
