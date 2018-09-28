/**
 * Create a dom element.
 * 
 * @param  {string}         tag
 * @return {HTMLElement}
 */
export const createElement = `
    function createElement(tag) {
        return document.createElement(tag);
    }
`;

/**
 * Create a text node.
 * 
 * @param  {String} text
 * @return {Text}
 */
export const createText = `
    function createText(text) {
        return document.createTextNode(text);
    }
`;

/**
 * Initialize a component.
 */
export const init = `
    function init(component, options) {

    }
`;

/**
 * Insert an element into the dom.
 * 
 * @param  {Node}   target
 * @param  {any}    node
 * @param  {Node}   anchor
 * @return {void}
 */
export const insert = `
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor);
    }
`;

/**
 * Mount a component to the dom.
 */
export const mount = `
    function mount(elementOrSelector) {
        console.log('hey', this);
    }
`

/**
 * No-operation.
 * 
 * @return {void}
 */
export const noop = `
    function noop() {}
`;
