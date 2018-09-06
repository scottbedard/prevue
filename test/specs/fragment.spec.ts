import Code from 'src/compiler/code';
import Fragment from 'src/compiler/fragment';
import { expect } from 'chai';
import { expectCode } from 'test/utils';

//
// specs
//
describe('fragment', function () {
    it('accepts a name as the first argument', function () {
        const fragment = new Fragment('hello');
        
        expect(fragment.name).to.equal('hello');
    });

    it('renders "noop" for empty partials', function () {
        const fragment = new Fragment('whatever');

        expectCode(fragment.render()).to.equal(`
            function noop(){}
            
            function whatever() {
                return {
                    c: noop,
                    m: noop,
                    p: noop,
                    d: noop,
                };
            }
        `);
    });

    it('exposes an "init" partial', function () {
        const fragment = new Fragment('whatever');

        fragment.append(`doSomething()`, 'init');

        expectCode(fragment.render()).to.equal(`
            function noop(){}

            function whatever() {
                doSomething();
            
                return {
                    c: noop,
                    m: noop,
                    p: noop,
                    d: noop,
                };
            }
        `);
    });

    it('exposes a partial for each lifecycle hook', function () {
        const fragment = new Fragment('whatever');

        fragment.append('// create', 'create');
        fragment.append('// mount', 'mount');
        fragment.append('// update', 'update');
        fragment.append('// destroy', 'destroy');

        expectCode(fragment.render()).to.equal(`
            function whatever() {
                return {
                    c: function create() {
                        // create
                    },
                    m: function mount(target, anchor) {
                        // mount
                    },
                    p: function update() {
                        // update
                    },
                    d: function destroy() {
                        // destroy
                    },
                };
            }
        `);
    });
});