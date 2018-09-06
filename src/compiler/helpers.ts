interface Helpers {
    [key: string]: (name: string) => string,
}

/**
 * Create a dom element.
 * 
 * @param  {string} tag
 * @return {string}
 */
const createElement = (name: string): string => `
    function ${name}(tag) {
        return document.createElement(tag);
    }
`;

/**
 * Create a text node.
 * 
 * @param  {string} text
 * @return {string}
 */
const createText = (name: string): string => `
    function ${name}(text) {
        return document.createTextNode(text);
    }
`;

/**
 * Initialize a component.
 * 
 * @param  {string} name 
 * @return {string}
 */
const init = (name: string): string => `
    function ${name}(vm, options) {
        vm.$mount = function(target) {
            console.log ('mounting');
        }
    }
`;

/**
 * Insert an element into the dom.
 * 
 * @param  {string} text
 * @return {string}
 */
const insert = (name: string): string => `
    function ${name}(target, node, anchor) {
        target.insertBefore(node, anchor);
    }
`;

/**
 * No-operation.
 * 
 * @param  {string}     name
 * @return {string}
 */
const noop = (name: string): string => `
    function ${name}(){}
`;

/**
 * Export
 */
const helpers: Helpers = {
    createElement,
    createText,
    init,
    insert,
    noop,
};

export default helpers;

