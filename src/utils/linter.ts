import { Linter } from 'eslint';

/**
 * Rules  
 */
type Rules = { 
    [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions,
};

const rules: Rules = {
    'comma-style': ['error', 'last'],
    'indent': ['error', 4, { "ObjectExpression": 1 }],
    'key-spacing': ['error', { 
        afterColon: true, 
        beforeColon: false,
        mode: 'strict',
    }],
    'newline-before-return': 'error',
    'no-multi-spaces': ['error', 'always'],
    'no-multiple-empty-lines': ['error', {
        max: 1,
    }],
    'no-trailing-spaces': 'error',
    'padded-blocks': ['error', 'never'],
    'semi': ['error', 'always', {
        omitLastInOneLineBlock: false
    }],
    'space-before-keywords': ['error', 'always'],
}

/**
 * Lint a piece of code.
 * 
 * @param  {string} src
 * @return {string}
 */
const linter = new Linter;

export function lint(src: string): string {
    // console.log ('linting', src);
    // console.log ('result', linter.verifyAndFix(src.trim(), { rules }).output)
    return linter.verifyAndFix(src.trim(), { rules }).output;
}