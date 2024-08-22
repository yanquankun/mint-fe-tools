const globby = require('globby');
const { getPathAbsoluteRoot } = require('../utils/file');
const fs = require('fs-extra');
const path = require('path');
const _log = require('../utils/logger');
const ejs = require('ejs');

module.exports = {
  injectImports: (file, imports) => {
    const _imports = this.generator.imports[file] || (this.generator.imports[file] = new Set());
    (Array.isArray(imports) ? imports : [imports]).forEach((imp) => {
      _imports.add(imp);
    });
  },
  render: async (absoluteDir, ejsOptions, isDebug = false) => {
    const templatePath = getPathAbsoluteRoot(absoluteDir);
    const files = await globby(['**/*'], { cwd: templatePath, dot: true });
    isDebug && _log.info(`获取所有模板文件：${files}`, 'render');
    files.forEach((rawPath) => {
      const targetPath = rawPath
        .split('/')
        .map((filename) => {
          // dotfiles are ignored when published to npm, therefore in templates
          // we need to use underscore instead (e.g. "_gitignore")
          if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
            return `.${filename.slice(1)}`;
          }
          if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
            return `${filename.slice(1)}`;
          }
          return filename;
        })
        .join('/');

      const filePath = path.join(templatePath, targetPath);
      const content = fs.readFileSync(filePath, 'utf-8');
      const renderContent = ejs.render(content, ejsOptions);
      if (Buffer.isBuffer(renderContent) || /[^\s]/.test(renderContent)) {
        files[targetPath] = renderContent;
      }
    });
    return files;
  },
};
