"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../parser/parser");
var code_1 = require("./code");
/**
 * Compiler.
 */
var Compiler = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {string}          source
     * @param {CompilerOptions} options
     */
    function Compiler(options, source) {
        if (source === void 0) { source = ''; }
        /**
         * @var parsedSource
         */
        this.parsedSource = null;
        this.options = options;
        this.source = source;
        this.code = new code_1.default("\n            'use strict';\n\n            :fragments\n\n            return function " + options.name + "() {\n                // ...\n            }\n        ");
    }
    /**
     * Compile to javascript.
     *
     * @return  {CompilerOutput}
     */
    Compiler.prototype.compile = function () {
        return {
            code: this.code.toString(),
        };
    };
    /**
     * Parse source code.
     *
     * @return {void}
     */
    Compiler.prototype.parse = function () {
        this.parsedSource = parser_1.parse(this.source, this.options);
    };
    return Compiler;
}());
exports.default = Compiler;
//# sourceMappingURL=compiler.js.map