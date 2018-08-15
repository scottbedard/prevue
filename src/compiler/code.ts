import Compiler from './compiler';

export default abstract class Code {
    /**
     * @var compiler
     */
    compiler: Compiler;

    /**
     * Constructor.
     * 
     * @param {Compiler}    compiler
     */
    constructor(compiler: Compiler) {
        this.compiler = compiler;
    }

    /**
     * Generate code.
     * 
     * @return {string}
     */
    abstract generate(): string;

    /**
     * Generate and process code.
     * 
     * @return {string}
     */
    getProcessedCode(): string {
        let processedCode = this.generate();

        if (this.compiler.options.cleanOutput) {
            processedCode = this.removeLeadingIndentation(processedCode);
        }

        return processedCode;
    }

    /**
     * Remove the leading indentation from code.
     * 
     * @param  {string}     code
     * @return {string} 
     */
    removeLeadingIndentation(code: string): string {
        let processedCode = code;

        function allLinesStartWithWhitespace(src: string) {
            const lines = src.split('\n');
            return lines.filter(l => l.startsWith(' ') || l.length === 0).length === lines.length;
        }

        while (allLinesStartWithWhitespace(processedCode)) {
            processedCode = processedCode.split('\n').map(l => l.substr(1)).join('\n');
        }

        return processedCode;
    }
}