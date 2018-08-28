import Fragment from '../../src/compiler/fragment';
import Code from '../../src/compiler/code';

//
// specs
//
describe('fragment', function () {
    it.skip('renders "noop" for empty partials, or content if populated', function () {
        const frag = new Fragment;

        frag.append(`
            // hello world
        `, 'create');

        console.log(frag.toString());
    });
});