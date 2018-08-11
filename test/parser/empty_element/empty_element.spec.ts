const fs = require('fs');
const path = require('path');
const { parse } = require('../../../src/parser/parser');

//
// parse
//
const src = fs.readFileSync(path.resolve(__dirname, './component.vue'), 'utf8');
const { template } = parse(src);

//
// specs
//
test('empty element', function () {
    expect(template).toMatchObject({
        children: [],
        nodeType: 'element',
        tagName: 'div',
        textContent: null,
    });
});
