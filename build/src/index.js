"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("./compiler/compiler");
/**
 * Compile source code into a component.
 *
 * @param  {string}   source    the raw source code
 * @param  {Object}   options   compiler options
 * @return {void}
 */
function compile(source, options) {
    var compiler = new compiler_1.default(options, source);
    var code = compiler.compile();
    return {
        code: code,
    };
}
exports.compile = compile;
//# sourceMappingURL=index.js.map