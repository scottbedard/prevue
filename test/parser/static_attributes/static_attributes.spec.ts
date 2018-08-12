import * as fs from 'fs';
import * as path from 'path';
import expected from './expected';
import { parse } from '../../../src/parser/parser';

//
// specs
//
describe('static_attributes', function () {
    const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');

    const output = parse(src);

    // throw JSON.stringify(output, null, 4);

    it('static_attributes', () => {
        expect(output).toMatchObject(expected);
        expect(output.template.staticAttrs).toEqual(expected.template.staticAttrs);
    });
});
