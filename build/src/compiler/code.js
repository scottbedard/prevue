"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compose code.
 *
 * @param  {source}     source      outer source code
 * @return {string}
 */
var Code = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param  {string}     src
     * @param  {Partials}   partials
     */
    function Code(src) {
        /**
         * @var {Helpers} helpers
         */
        this.helpers = {};
        /**
         * @var {Code|null} parent
         */
        this.parent = null;
        /**
         * @var {Partials} partials
         */
        this.partials = {};
        this.src = src;
        this.partials = findPartials(this);
    }
    /**
     * Append code to a partial.
     *
     * @param  {string}         target
     * @param  {Code|string}    content
     * @return {void}
     */
    Code.prototype.append = function (content, target) {
        var code = getCodeFromContent(content);
        code.parent = this;
        this.partials[target].push(code);
    };
    /**
     * Determine if this is the root code instance.
     *
     * @return {boolean}
     */
    Code.prototype.isRoot = function () {
        return this === this.root;
    };
    /**
     * Register a helper.
     *
     * @param  {string}         name
     * @param  {Code|string}    content
     * @return {void}
     */
    Code.prototype.registerHelper = function (name, content) {
        var _a;
        var helper = getCodeFromContent(content);
        var root = this.root;
        root.helpers = __assign({}, root.helpers, (_a = {}, _a[name] = helper, _a));
    };
    Object.defineProperty(Code.prototype, "root", {
        /**
         * Get the root code instance.
         *
         * @return {Code|null}
         */
        get: function () {
            var level = this;
            while (level.parent) {
                level = level.parent;
            }
            return level;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cast to a string.
     *
     * @return {string}
     */
    Code.prototype.toString = function () {
        var _this = this;
        var output = cleanWhitespace(this.src);
        // prepend helpers
        if (this.isRoot()) {
            output = Object.keys(this.helpers)
                .map(function (name) { return _this.helpers[name]; })
                .concat(output)
                .join('\n\n');
        }
        // replace partials
        output = output.replace(/\:\w+/g, function (partial, offset) {
            var name = partial.slice(1);
            var indentation = indentationAtOffset(output, offset);
            return _this.partials[name]
                .map(function (code) {
                return code.toString()
                    .split('\n')
                    .map(function (ln, i) { return i === 0 ? ln : indentation + ln; })
                    .join('\n');
            })
                .join('\n');
        });
        return output.replace(/\n\n\n+/g, '\n\n').trim();
    };
    return Code;
}());
exports.default = Code;
/**
* Remove the extra indentation and whitespace from code.
*
* @param  {string}     src
* @return {string}
*/
function cleanWhitespace(src) {
    var lines = src.split('\n');
    while (isIndented(lines)) {
        lines = lines.map(function (line) { return line.substr(1); });
    }
    return lines.join('\n').trim();
}
/**
 * Find the partials in a piece of code.
 *
 * @param  {Code}   code
 */
function findPartials(code) {
    return (code.src.match(/\:\w+/g) || []).reduce(function (partials, partial) {
        var _a;
        return __assign({}, partials, (_a = {}, _a[partial.slice(1)] = [], _a));
    }, {});
}
/**
 * Get a code instance.
 *
 * @param  {Code|string}    content
 * @return {Code}
 */
function getCodeFromContent(content) {
    return typeof content === 'string' ? new Code(cleanWhitespace(content)) : content;
}
/**
 * Get the indentation at a particular offset.
 *
 * @param  {string}     src
 * @param  {number}     offset
 * @return {number}
 */
function indentationAtOffset(src, offset) {
    var line = src.slice(0, offset).split('\n').pop() || '';
    return line.substring(0, line.search(/\S|$/));
}
/**
 * Determine if all lines start with whitespace.
 *
 * @param  {Array<string>|string}   src
 * @return {boolean}
 */
function isIndented(src) {
    var lines = Array.isArray(src) ? src : src.split('\n');
    return lines.filter(function (ln) { return ln.startsWith(' ') || ln.length === 0; }).length === lines.length;
}
//# sourceMappingURL=code.js.map