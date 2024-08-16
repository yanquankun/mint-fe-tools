const Module = require('module');
const path = require('path');
const _log = require('../utils/logger');

function resolveFallback(request, options) {
  const isMain = false;
  const fakeParent = new Module('', null);

  const paths = [];
  for (let i = 0; i < options.paths.length; i++) {
    const p = options.paths[i];

    fakeParent.paths = Module._nodeModulePaths(p);
    const lookupPaths = Module._resolveLookupPaths(request, fakeParent, true);

    if (!paths.includes(p)) paths.push(p);

    for (let j = 0; j < lookupPaths.length; j++) {
      if (!paths.includes(lookupPaths[j])) paths.push(lookupPaths[j]);
    }
  }

  const filename = Module._findPath(request, paths, isMain);
  if (!filename) {
    const err = new Error(`Cannot find module '${request}'`);
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }
  return filename;
}

const createRequire =
  Module.createRequire ||
  Module.createRequireFromPath ||
  function (filename) {
    const mod = new Module(filename, null);
    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(path.dirname(filename));

    mod._compile(`module.exports = require;`, filename);

    return mod.exports;
  };

function clearRequireCache(id, map = new Map()) {
  const module = require.cache[id];
  if (module) {
    map.set(id, true);
    module.children.forEach((child) => {
      if (!map.get(child.id)) clearRequireCache(child.id, map);
    });
    delete require.cache[id];
  }
}

exports.resolveModule = function (request, context) {
  let resolvedPath;
  try {
    try {
      resolvedPath = createRequire(path.resolve(context, 'package.json')).resolve(request);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      resolvedPath = resolveFallback(request, { paths: [context] });
    }
  } catch (e) {
    console.log('resolveModule error', e);
  }
  return resolvedPath;
};

exports.loadModule = function (request, context, force = false) {
  try {
    return createRequire(path.resolve(context, 'package.json'))(request);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    const resolvedPath = exports.resolveModule(request, { paths: [context] });
    if (resolvedPath) {
      if (force) {
        clearRequireCache(resolvedPath);
      }
      return require(resolvedPath);
    }
  }
};

exports.loadLocalModule = function (request, context) {
  try {
    return require(path.relative(context, request));
  } catch (e) {
    _log.error(e, request);
  }
};
