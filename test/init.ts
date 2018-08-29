import * as chai from 'chai';
import chaiSubset = require('chai-subset');
import * as uglify from 'uglify-js';
import { cleanWhitespace } from '../src/utils/code';

//
// object subset assertions
//
chai.use(chaiSubset);

//
// custom assertions
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

        new _chai.Assertion(minify(actual)).to.equal(minify(expected), `\n\nExpected:\n${cleanWhitespace(expected)}\n\nActual:\n${cleanWhitespace(actual)}\n\n`);
    });
});