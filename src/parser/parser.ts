import { JSDOM } from 'jsdom';
import { Node } from 'highlight.js';
import { 
    CompilerOptions, 
    NodeStaticAttrs,
    NodeType, 
    ParsedSource,
    SerializedNode,
} from '../types';

/**
 * Parse source code into an abstract syntax tree
 * 
 * @param  {string} source  raw source code to parse  
 * @return {Object} 
 */
export function parse(source: string, options: CompilerOptions = {}): ParsedSource {
    const rootElement = getRootElement(source);
    const template = serializeNode(rootElement, options);

    return {
        template
    };
}

/**
 * Get child nodes, and purge empty text nodes if whitespace is being trimmed.
 * 
 * @param  {Element}                    node
 * @param  {NodeType}                   nodeType
 * @param  {CompilerOptions}            options
 * @return {Array<SerializedNode>|null}
 */
function getChildNodes(
    node: Element, 
    nodeType: NodeType, 
    options: CompilerOptions
): Array<SerializedNode> | null {
    if (nodeType === 'text') {
        return null;
    }

    return Array.from(node.childNodes).reduce<Array<SerializedNode>>((children, child) => {
        const childNode = serializeNode(<Element> child, options);

        // skip entirely empty text nodes if we're trimming whitespace
        if (options.trimWhitespace && childNode.nodeType === 'text' && childNode.textContent === '') {
            return children;
        }

        return children.concat(childNode);
    }, []);
}

/**
 * Convert a nodeType into an easy to read string
 * 
 * @param  {Element}    node
 * @return {NodeType} 
 */
function getNodeType(node: Element): NodeType {
    if (node.nodeType === 1) return 'element';
    if (node.nodeType === 3) return 'text';
    return 'unknown';
}

/**
 * Get the root element of our template.
 * 
 * @param  {string}             source      raw source code
 * @return {Element}
 */
function getRootElement(source: string): Element {
    const { document } = new JSDOM(source).window;
    const template = document.querySelector('template');

    if (template === null) {
        throw new Error('Failed to parse component, no template found.');
    }

    const rootElement = template.content.firstElementChild;

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
function getStaticAttrs(node: Element, nodeType: NodeType): NodeStaticAttrs | null {
    if (nodeType !== 'element') {
        return null;
    }

    return Array.from(node.attributes).reduce<NodeStaticAttrs>((staticAttrs, attr) => {
        const name = String(attr.localName);

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
function getTagName(node: Element, nodeType: NodeType): string | null {
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
function getTextContent(node: Element, nodeType: NodeType, options: CompilerOptions): string | null {
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
function serializeNode(node: Element, options: CompilerOptions): SerializedNode {
    const nodeType = getNodeType(node);

    return {
        children: getChildNodes(node, nodeType, options),
        nodeType,
        staticAttrs: getStaticAttrs(node, nodeType),
        tagName: getTagName(node, nodeType),
        textContent: getTextContent(node, nodeType, options),
    };
}