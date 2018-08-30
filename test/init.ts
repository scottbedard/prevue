import * as chai from 'chai';
import chaiSubset = require('chai-subset');
import * as uglify from 'uglify-js';
import { lint } from '../src/utils/linter';

//
// object subset assertions
//
chai.use(chaiSubset);

//
// custom chai assertions
//
declare global {
    export namespace Chai {
        interface Assertion {
            equalCode(expectedSouce: string): void;
        }
    }
}

chai.use(function (_chai, utils) {
    _chai.Assertion.addMethod('equalCode', function(this: any, expected: string) {
        const minify = (src: string) => uglify.minify(src, {
            compress: {
                
            },
            mangle: false,
        }).code;

        const actual = String(this._obj);

        try {
            new _chai.Assertion(minify(actual)).to.equal(minify(expected));
        } catch (e) {
            const lintActual = lint(actual).trim().split('\n').map(ln => '    ' + ln).join('\n');
            const lintExpected = lint(expected).trim().split('\n').map(ln => '    ' + ln).join('\n');

            throw new Error(`\n\nFailed asserting code equality\n\nExpected:\n${lintExpected}\n\nActual:\n${lintActual}\n\n`);
        }
    });
});

export {};