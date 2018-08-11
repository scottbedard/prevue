import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../../../src/parser/parser';

//
// specs
//
describe('empty element', function () {
    const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');
    const { template } = parse(src);

    it('serialization', function () {
        expect(template).toEqual({
            children: [],
            tagName: 'div',
            textContent: '',
        });
    });
});
