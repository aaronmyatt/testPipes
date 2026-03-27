var PD;
(PD ||= {}).exportIt = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../../../Library/Caches/deno/deno_esbuild/registry.npmjs.org/jsonpointer@5.0.1/node_modules/jsonpointer/jsonpointer.js
  var require_jsonpointer = __commonJS({
    "../../../Library/Caches/deno/deno_esbuild/registry.npmjs.org/jsonpointer@5.0.1/node_modules/jsonpointer/jsonpointer.js"(exports) {
      var hasExcape = /~/;
      var escapeMatcher = /~[01]/g;
      function escapeReplacer(m) {
        switch (m) {
          case "~1":
            return "/";
          case "~0":
            return "~";
        }
        throw new Error("Invalid tilde escape: " + m);
      }
      function untilde(str) {
        if (!hasExcape.test(str)) return str;
        return str.replace(escapeMatcher, escapeReplacer);
      }
      function setter(obj, pointer, value) {
        var part;
        var hasNextPart;
        for (var p = 1, len = pointer.length; p < len; ) {
          if (pointer[p] === "constructor" || pointer[p] === "prototype" || pointer[p] === "__proto__") return obj;
          part = untilde(pointer[p++]);
          hasNextPart = len > p;
          if (typeof obj[part] === "undefined") {
            if (Array.isArray(obj) && part === "-") {
              part = obj.length;
            }
            if (hasNextPart) {
              if (pointer[p] !== "" && pointer[p] < Infinity || pointer[p] === "-") obj[part] = [];
              else obj[part] = {};
            }
          }
          if (!hasNextPart) break;
          obj = obj[part];
        }
        var oldValue = obj[part];
        if (value === void 0) delete obj[part];
        else obj[part] = value;
        return oldValue;
      }
      function compilePointer(pointer) {
        if (typeof pointer === "string") {
          pointer = pointer.split("/");
          if (pointer[0] === "") return pointer;
          throw new Error("Invalid JSON pointer.");
        } else if (Array.isArray(pointer)) {
          for (const part of pointer) {
            if (typeof part !== "string" && typeof part !== "number") {
              throw new Error("Invalid JSON pointer. Must be of type string or number.");
            }
          }
          return pointer;
        }
        throw new Error("Invalid JSON pointer.");
      }
      function get(obj, pointer) {
        if (typeof obj !== "object") throw new Error("Invalid input object.");
        pointer = compilePointer(pointer);
        var len = pointer.length;
        if (len === 1) return obj;
        for (var p = 1; p < len; ) {
          obj = obj[untilde(pointer[p++])];
          if (len === p) return obj;
          if (typeof obj !== "object" || obj === null) return void 0;
        }
      }
      function set(obj, pointer, value) {
        if (typeof obj !== "object") throw new Error("Invalid input object.");
        pointer = compilePointer(pointer);
        if (pointer.length === 0) throw new Error("Invalid JSON pointer for set.");
        return setter(obj, pointer, value);
      }
      function compile(pointer) {
        var compiled = compilePointer(pointer);
        return {
          get: function(object) {
            return get(object, compiled);
          },
          set: function(object, value) {
            return set(object, compiled, value);
          }
        };
      }
      exports.get = get;
      exports.set = set;
      exports.compile = compile;
    }
  });

  // .pd/exportIt/index.ts
  var index_exports = {};
  __export(index_exports, {
    Exportsyo: () => Exportsyo,
    default: () => index_default2,
    pipe: () => pipe,
    process: () => process,
    rawPipe: () => index_default
  });

  // https://jsr.io/@pd/pdpipe/0.2.2/pipeline.ts
  var Pipeline = class {
    stages = [];
    defaultArgs = {};
    constructor(presetStages = [], defaultArgs = {}) {
      this.defaultArgs = defaultArgs;
      this.stages = presetStages || [];
    }
    pipe(stage) {
      this.stages.push(stage);
      return this;
    }
    process(args) {
      args = Object.assign({}, this.defaultArgs, args);
      if (this.stages.length === 0) {
        return args;
      }
      let stageOutput = Promise.resolve(args);
      this.stages.forEach(function(stage, _counter) {
        stageOutput = stageOutput.then(stage);
      });
      return stageOutput;
    }
  };
  var pipeline_default = Pipeline;

  // https://jsr.io/@pd/pointers/0.1.0/mod.ts
  var import_npm_jsonpointer_5_0 = __toESM(require_jsonpointer());
  var setNew = (data, path) => {
    const tmpObj = {};
    import_npm_jsonpointer_5_0.default.set(tmpObj, path, data);
    return tmpObj;
  };
  Object.defineProperty(import_npm_jsonpointer_5_0.default, "new", { value: setNew, writable: false, configurable: false, enumerable: false });
  var mod_default = import_npm_jsonpointer_5_0.default;

  // https://jsr.io/@pd/pdpipe/0.2.2/pdUtils.ts
  function funcWrapper(funcs, opts) {
    opts.$p = mod_default;
    return funcs.map((func, index) => {
      const config = Object.assign(
        {
          checks: [],
          not: [],
          or: [],
          and: [],
          routes: [],
          only: false,
          stop: false
        },
        mod_default.get(opts, "/steps/" + index + "/config")
      );
      return { func, config };
    }).map(
      ({ func, config }, index) => async function(input) {
        const only = config.only || input?.only;
        if (only && only !== index) return input;
        const stop = config.stop || input?.stop;
        if (index > stop) return input;
        if (input?.errors && input.errors.length > 0) return input;
        const shouldBeFalsy = config.not.map(
          (check) => mod_default.get(input, check)
        ).some((check) => check);
        if (shouldBeFalsy) return input;
        const checker = (check) => {
          return [check.split("/").pop() || check, mod_default.get(input, check)];
        };
        const validator = config.and.length ? "every" : "some";
        const conditions = config.checks.map(checker).concat(
          config.and.map(checker)
        );
        const orConditions = config.or.map(checker);
        if (conditions.length) {
          const firstChecks = conditions[validator](([_key, value]) => !!value);
          const orChecks = orConditions.some(
            ([_key, value]) => !!value
          );
          if (firstChecks) {
            mod_default.set(opts, "/checks", Object.fromEntries(conditions));
          } else if (orChecks) {
            mod_default.set(opts, "/checks", Object.fromEntries(orConditions));
          } else {
            return input;
          }
        }
        if (config.routes.length) {
          const route = config.routes.map((route2) => new URLPattern({ pathname: route2 })).find((route2) => {
            return route2.test(input.request?.url);
          });
          if (!route) return input;
          input.route = route.exec(input.request.url);
        }
        try {
          await func(input, opts);
        } catch (e) {
          input.errors = input.errors || [];
          input.errors.push({
            message: e.message,
            stack: e.stack,
            name: e.name,
            func: func.name
          });
        }
        return input;
      }
    ).map((func, index) => {
      Object.defineProperty(func, "name", {
        value: `${index}-${funcs[index].name}`
      });
      return func;
    });
  }

  // https://jsr.io/@pd/pdpipe/0.2.2/mod.ts
  function Pipe(funcs, opts) {
    const wrappedFuncs = funcWrapper(funcs, opts);
    return new pipeline_default(wrappedFuncs);
  }

  // .pd/exportIt/index.json
  var index_default = {
    mdPath: "/Users/aaronmyatt/pipes/core/testPipes/exportIt.md",
    fileName: "exportIt",
    dir: ".pd/exportIt",
    absoluteDir: "/Users/aaronmyatt/pipes/core/testPipes/.pd/exportIt",
    config: {
      inGlobal: true,
      exclude: [
        "envTest.md"
      ],
      templates: [
        "./denoflare.ts",
        "./templates/cli.ts",
        "./templates/server.ts",
        "./templates/worker.ts",
        "./templates/test.ts",
        "./templates/trace.ts"
      ],
      build: [
        {
          format: "esm"
        },
        {
          format: "cjs"
        },
        {
          format: "iife"
        }
      ]
    },
    name: "Exports yo",
    cleanName: "Exportsyo",
    steps: [
      {
        code: "console.log('Hello World')\n",
        range: [
          7,
          7
        ],
        name: "Exports yo",
        funcName: "Exportsyo",
        inList: false,
        language: "ts",
        headingLevel: 1,
        description: '// {"format": "esm", "outfile": "dist/exportIt.mjs"},\n// {"format": "cjs", "outfile": "dist/exportIt.cjs"},\n// {"format": "iife", "outfile": "dist/exportIt.js"}'
      }
    ],
    pipeDescription: '// {"format": "esm", "outfile": "dist/exportIt.mjs"},\n// {"format": "cjs", "outfile": "dist/exportIt.cjs"},\n// {"format": "iife", "outfile": "dist/exportIt.js"}'
  };

  // .pd/exportIt/index.ts
  async function Exportsyo(input, opts) {
    console.log("Hello World");
  }
  var funcSequence = [
    Exportsyo
  ];
  var pipe = Pipe(funcSequence, index_default);
  var process = (input = {}) => pipe.process(input);
  pipe.json = index_default;
  var index_default2 = pipe;
  return __toCommonJS(index_exports);
})();
