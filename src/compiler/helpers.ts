import Code from "./code";

/**
 * Interfaces
 */
interface Helpers {
    [key: string]: (name: string) => string,
}

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
    noop,
};

export default helpers;

