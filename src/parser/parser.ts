import { JSDOM } from 'jsdom';

import { 
    CompilerOptions, 
    NodeDynamicAttrs,
    NodeStaticAttrs,
    NodeType, 
    ParsedSource,
    SerializedNode,
} from 'src/types';

/**
 * Parse source code into an abstract syntax tree
 * 
 * @param  {string} source  raw source code to parse  
 * @return {Object} 
 */
export function parse(source: string, options: CompilerOptions): ParsedSource {
    const rootElement = getRootElement(source);
    const template = serializeNode(rootElement, true, options);

    return {
        template
    };
}

/**
 * Get child nodes, and purge empty text nodes if whitespace is being trimmed.
 * 
 * @param  {Element}                node
 * @param  {NodeType}               nodeType
 * @param  {CompilerOptions}        options
 * @return {Array<SerializedNode>}
 */
function getChildNodes(
    node: Element, 
    nodeType: NodeType, 
    options: CompilerOptions
): Array<SerializedNode> {
    if (nodeType === 'text') {
        return [];
    }

    return Array.from(node.childNodes).reduce<Array<SerializedNode>>((children, child) => {
        const childNode = serializeNode(<Element> child, false, options);

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
function getDynamicAttrs(node: Element, nodeType: NodeType, options: CompilerOptions): NodeDynamicAttrs {
    if (nodeType !== 'element') {
        return {};
    }
        
    return Array.from(node.attributes)
        .filter(attr => attr.localName && (attr.localName.startsWith('v-bind') || attr.localName.startsWith(':')))
        .reduce((result, attr) => {
            const rawName = attr.localName || '';
            const rawValue = attr.value;
            const name = rawName.slice(rawName.indexOf(':') + 1);

            return {
                ...result,
                [name]: {
                    rawValue,
                },
            }
        }, {});
}

/**
 * Convert a nodeType into an easy to read string
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#Constants
 * 
 * @param  {Element}    node
 * @return {NodeType} 
 */
function getNodeType(node: Element): NodeType {
    if (node.nodeType === 1) return 'element';
    if (node.nodeType === 3) return 'text';
    // @todo: if (node.nodeType === 4) return 'cdata';
    // @todo: if (node.nodeType === 7) return 'processingInstruction';
    // @todo: if (node.nodeType === 8) return 'comment';
    // @todo: if (node.nodeType >= 9 && node.nodeType <= 11) throw new Error('Document elements cannot be used in templates');

    // it shouldn't be possible to get here, but just incase use "unknown"
    /* istanbul ignore next */
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
        throw new Error('Failed to mount component: template or render function not defined.');
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
 * @param  {boolean}            isRoot      determines if this is the root node
 * @param  {CompilerOptions}    options     compiler options
 * @return {Object}
 */
function serializeNode(node: Element, isRoot: boolean, options: CompilerOptions): SerializedNode {
    const nodeType = getNodeType(node);

    return {
        children: getChildNodes(node, nodeType, options),
        dynamicAttrs: getDynamicAttrs(node, nodeType, options),
        isRoot,
        nodeType,
        staticAttrs: getStaticAttrs(node, nodeType),
        tagName: getTagName(node, nodeType),
        textContent: getTextContent(node, nodeType, options),
    };
}