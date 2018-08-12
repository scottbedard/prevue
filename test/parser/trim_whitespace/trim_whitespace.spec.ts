import * as fs from 'fs';
import * as path from 'path';
import expected from './expected';
import { parse } from '../../../src/parser/parser';

//
// spec
//
describe('trim whitespace', function () {
    const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');

    const output = parse(src, {
        trimWhitespace: true,
    });

    test('trim whitespace', () => expect(output).toMatchObject(expected));
});
