import { JSDOM } from 'jsdom';
import { Node } from 'highlight.js';
import { SerializedElement } from '../types';

/**
 * Parse source code into an abstract syntax tree
 * 
 * @param  {string} source  raw source code to parse  
 * @return {Object} 
 */
export function parse(source: string) {
    const rootElement = getRootElement(source);
    const template = serialize(rootElement);

    return {
        template
    };
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
function serialize(el: Element): SerializedElement {
    return {
        children: Array.from(el.children).map(serialize),
        tagName: el.tagName.toLowerCase(),
        textContent: el.textContent,
    };
}