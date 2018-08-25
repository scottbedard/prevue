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
var jsdom_1 = require("jsdom");
/**
 * Parse source code into an abstract syntax tree
 *
 * @param  {string} source  raw source code to parse
 * @return {Object}
 */
function parse(source, options) {
    var rootElement = getRootElement(source);
    var template = serializeNode(rootElement, options);
    return {
        template: template
    };
}
exports.parse = parse;
/**
 * Get child nodes, and purge empty text nodes if whitespace is being trimmed.
 *
 * @param  {Element}                    node
 * @param  {NodeType}                   nodeType
 * @param  {CompilerOptions}            options
 * @return {Array<SerializedNode>|null}
 */
function getChildNodes(node, nodeType, options) {
    if (nodeType === 'text') {
        return null;
    }
    return Array.from(node.childNodes).reduce(function (children, child) {
        var childNode = serializeNode(child, options);
        // skip entirely empty text nodes if we're trimming whitespace
        if (options.trimWhitespace && childNode.nodeType === 'text' && childNode.textContent === '') {
            return children;
        }
        return children.concat(childNode);
    }, []);
}
/**
 * Get an element's dynamic attributes.
 *
 * @param  {Element}            node
 * @return {NodeDynamicAttrs}
 */
function getDynamicAttrs(node, nodeType, options) {
    if (nodeType !== 'element') {
        return {};
    }
    return Array.from(node.attributes)
        .filter(function (attr) { return attr.localName && (attr.localName.startsWith('v-bind') || attr.localName.startsWith(':')); })
        .reduce(function (result, attr) {
        var _a;
        var rawName = attr.localName || '';
        var rawValue = attr.value;
        var name = rawName.slice(rawName.indexOf(':') + 1);
        return __assign({}, result, (_a = {}, _a[name] = {
            rawValue: rawValue,
        }, _a));
    }, {});
}
/**
 * Convert a nodeType into an easy to read string
 *
 * @param  {Element}    node
 * @return {NodeType}
 */
function getNodeType(node) {
    if (node.nodeType === 1)
        return 'element';
    if (node.nodeType === 3)
        return 'text';
    return 'unknown';
}
/**
 * Get the root element of our template.
 *
 * @param  {string}             source      raw source code
 * @return {Element}
 */
function getRootElement(source) {
    var document = new jsdom_1.JSDOM(source).window.document;
    var template = document.querySelector('template');
    if (template === null) {
        throw new Error('Failed to parse component, no template found.');
    }
    var rootElement = template.content.firstElementChild;
    if (rootElement === null) {
        throw new Error('Failed to parse template, no root element found.');
    }
    return rootElement;
}
/**
 * Get an element's static attributes.
 *
 * @param  {Element}            node
 * @param  {NodeType}           nodeType
 * @return {NodeStaticAttrs}
 */
function getStaticAttrs(node, nodeType) {
    if (nodeType !== 'element') {
        return null;
    }
    return Array.from(node.attributes).reduce(function (staticAttrs, attr) {
        var name = String(attr.localName);
        if (!name.startsWith('v-') && !name.startsWith(':')) {
            staticAttrs[name] = attr.value;
        }
        return staticAttrs;
    }, {});
}
/**
 * Get an element's tag name.
 *
 * @param  {Element}        node
 * @param  {NodeType}       nodeType
 * @return {string|null}
 */
function getTagName(node, nodeType) {
    return nodeType === 'element' ? node.tagName.toLowerCase() : null;
}
/**
 * Get the text content of a node.
 *
 * @param  {Element}            node
 * @param  {NodeType}           nodeType
 * @param  {CompilerOptions}    options
 * @return {string|null}
 */
function getTextContent(node, nodeType, options) {
    if (nodeType !== 'text' || node.textContent === null) {
        return null;
    }
    return options.trimWhitespace
        ? node.textContent.trim()
        : node.textContent;
}
/**
 * Serialize a dom node and all of it's children.
 *
 * @param  {Element}            el          the element being serialized
 * @param  {CompilerOptions}    options     compiler options
 * @return {Object}
 */
function serializeNode(node, options) {
    var nodeType = getNodeType(node);
    return {
        children: getChildNodes(node, nodeType, options),
        dynamicAttrs: getDynamicAttrs(node, nodeType, options),
        nodeType: nodeType,
        staticAttrs: getStaticAttrs(node, nodeType),
        tagName: getTagName(node, nodeType),
        textContent: getTextContent(node, nodeType, options),
    };
}
//# sourceMappingURL=parser.js.map