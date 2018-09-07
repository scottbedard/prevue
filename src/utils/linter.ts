import { Linter } from 'eslint';

/**
 * Rules  
 */
type Rules = { 
    [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions,
};

const rules: Rules = {
    'comma-style': ['error', 'last'],
    'indent': ['error', 4],
    'key-spacing': ['error', { 
        afterColon: true, 
        beforeColon: false,
        mode: 'strict',
    }],
    'keyword-spacing': ['error', { 
        before: true, 
        after: true,
    }],
    'newline-before-return': 'error',
    'no-multi-spaces': ['error', 'always'],
    'no-multiple-empty-lines': ['error', {
        max: 1,
    }],
    'no-trailing-spaces': 'error',
    'padded-blocks': ['error', 'never'],
    'padding-line-between-statements': [
        'error', 
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    'semi': ['error', 'always', {
        omitLastInOneLineBlock: false
    }],
}

/**
 * Lint a piece of code.
 * 
 * @param  {string} src
 * @return {string}
 */
const linter = new Linter;

export function lint(src: string): string {
    // parse and fix the output with eslint
    const result = linter.verifyAndFix(src.trim(), { 
        parserOptions: {
            ecmaFeatures: {
                globalReturn: true,
            },
            ecmaVersion: 6,
            sourceType: 'module',
        },
        rules,
    });

    // log an error if there were any fatal eslint errors
    result.messages
        .filter(message => message.fatal)
        .forEach(message => {
            console.error('Failed to parse output, aborting eslint fixing.');
            console.error(message);
        });

    // return the output
    return result.output;
}