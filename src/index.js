"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const fs = require("fs");
const path = require("path");

class ComponentOverridePlugin {
    constructor(options) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach((res) => {
            this.pathRegex.push(new RegExp(`^(.*)${res.prefix}`));
        });
        this.cache = {};
    }

    apply(resolver) {
        const target = resolver.ensureHook("resolved");
        resolver.getHook("resolve")
            .tapAsync("ComponentOverridePlugin", (request, resolveContext, callback) => {
                const chosenResolver = this.getResolver(request);
                if (chosenResolver) {
                    const absolute_path = path.join(request.path, request.request);
                    const req = absolute_path.replace(new RegExp(`^(.*)${chosenResolver.prefix}`), ".");
                    const resolvedPath = this.resolveComponentPath(req, chosenResolver.directories);
                    if (!resolvedPath) {
                        return callback();
                    }
                    const obj = Object.assign({}, request, {
                        path: resolvedPath,
                    });
                    resolver.doResolve(target, obj, `use ${resolvedPath} instead of ${request.request}`, resolveContext, callback);
                } else {
                    callback();
                }
            });
    }

    resolveComponentPath(reqPath, directories) {
        if (this.cache[reqPath] !== undefined) {
            return this.cache[reqPath];
        }
        const dirs = directories.map((dir) => path.resolve(path.resolve(dir), reqPath));
        const resolvedPath = dirs.find((pathName) => fs.existsSync(pathName));
        if (resolvedPath) {
            this.cache[reqPath] = resolvedPath;
        }
        return this.cache[reqPath];
    }

    getResolver(request) {
        let resolver;
        this.pathRegex.forEach((reg, x) => {
            const abs_path = path.join(request.path, request.request);
            if (abs_path.match(reg)) {
                resolver = Object.assign({}, ComponentOverridePlugin.defaultOptions, this.options[x]);
            }
        });
        return resolver;
    }
}

exports.ComponentOverridePlugin = ComponentOverridePlugin;
ComponentOverridePlugin.defaultOptions = {
    directories: [],
    prefix: "fallback",
};
module.exports = ComponentOverridePlugin;
