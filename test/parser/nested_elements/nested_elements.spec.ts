import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../../../src/parser/parser';

//
// spec
//
describe('nested_elements', function () {
    const source = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');
    
    const { template } = parse(source);
   
    it('nested elements', function () {
        expect(template).toMatchObject({
            "children": [
                {
                    "children": null,
                    "nodeType": "text",
                    "tagName": null,
                    "textContent": "\n        Foo bar baz\n        "
                },
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
                    "tagName": "p",
                    "textContent": null
                },
                {
                    "children": null,
                    "nodeType": "text",
                    "tagName": null,
                    "textContent": "\n    "
                }
            ],
            "nodeType": "element",
            "tagName": "div",
            "textContent": null
        });
    });
});
