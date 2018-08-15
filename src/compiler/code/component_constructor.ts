import Code from '../code';

export default class ConstructorFunction extends Code {

    /**
     * Generate code.
     * 
     * @return {string}
     */
    generate(): string {
        return `
            function ${this.compiler.options.name}(options) {

            }
        `
    }
}