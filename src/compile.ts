import type { TemplateOptions } from './types';
import { template } from './template';

export function compile(
  tmpl: string,
  options: TemplateOptions = {},
): (data: Record<string, unknown>) => string {
  return (data: Record<string, unknown>) => template(tmpl, data, options);
}
