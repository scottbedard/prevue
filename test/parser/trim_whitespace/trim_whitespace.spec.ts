import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../../../src/parser/parser';

//
// spec
//
describe('trim whitespace', function () {
    const options = {
        trimWhitespace: true,
    };

    const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');

    const { template } = parse(src, options);

    test('trim whitespace', function () {
        expect(template).toMatchObject({
            "children": [
                {
                    "children": [
                        {
                            "children": null,
                            "nodeType": "text",
                            "tagName": null,
                            "textContent": "Hello world"
                        }
                    ],
                    "nodeType": "element",
                    "tagName": "span",
                    "textContent": null
                }
            ],
            "nodeType": "element",
            "tagName": "div",
            "textContent": null
        });
    });
});
