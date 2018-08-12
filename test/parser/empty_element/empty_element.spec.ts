import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../../../src/parser/parser';

//
// specs
//
describe('empty_element', function () {
    const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');
    
    const { template } = parse(src);

    it('empty_element', function () {
        expect(template).toMatchObject({
            children: [],
            nodeType: 'element',
            tagName: 'div',
            textContent: null,
        });
    });
});
