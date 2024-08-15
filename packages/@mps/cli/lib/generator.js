module.exports = {
  injectImports: (file, imports) => {
    const _imports = this.generator.imports[file] || (this.generator.imports[file] = new Set());
    (Array.isArray(imports) ? imports : [imports]).forEach((imp) => {
      _imports.add(imp);
    });
  },
};
