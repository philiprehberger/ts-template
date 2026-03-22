export interface TemplateOptions {
  escape?: boolean;
  filters?: Record<string, (value: string) => string>;
}
