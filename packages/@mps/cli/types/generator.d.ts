// generator declaration
declare namespace generator {
  function injectImports(file: string, imports: string | string[]): void;
  function render(absoluteDir: string): Promise<Record<string, string>>;
}
