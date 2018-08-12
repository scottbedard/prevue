import * as fs from 'fs';
import * as path from 'path';
import expected from './expected';
import { parse } from '../../../src/parser/parser';

//
// spec
//
describe('nested_elements', function () {
    const source = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');
    const output = parse(source);
   
    it('nested elements', () => expect(output).toMatchObject(expected));
});
