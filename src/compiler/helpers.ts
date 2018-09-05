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
    noop,
};

export default helpers;

