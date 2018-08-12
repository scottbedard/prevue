import * as fs from 'fs';
import * as path from 'path';
import expected from './expected';
import { parse } from '../../../src/parser/parser';

//
// specs
//
describe('empty_element', function () {
    const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');
    
    const output = parse(src);

    it('empty_element', () => expect(output).toMatchObject(expected));
});
