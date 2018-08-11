import { JSDOM } from 'jsdom';
import { Node } from 'highlight.js';
import { NodeType, SerializedNode } from '../types';

/**
 * Parse source code into an abstract syntax tree
 * 
 * @param  {string} source  raw source code to parse  
 * @return {Object} 
 */
export function parse(source: string) {
    const rootElement = getRootElement(source);
    const template = serializeNode(rootElement);

    return {
        template
    };
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
 * @param  {string}     source  raw source code
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
 * Serialize a dom node and all of it's children.
 * 
 * @param  {Element}    el  the element being serialized
 * @return {Object}
 */
function serializeNode(node: Element): SerializedNode {
    const nodeType = getNodeType(node);
    const tagName = nodeType === 'element' ? node.tagName.toLowerCase() : null;
    const textContent = nodeType === 'text' ? node.textContent : null;

    return {
        children: nodeType === 'element'
            ? Array.from(node.childNodes).map(child => serializeNode(<Element> child))
            : null,
        nodeType,
        tagName,
        textContent,
    };
}