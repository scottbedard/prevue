import Fragment from '../../src/compiler/fragment';
import Code from '../../src/compiler/code';
import { expect } from 'chai';

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

        expect(fragment.render()).to.equalCode(`
            function noop(){}
            
            function whatever() {
                return {
                    c: noop,
                    d: noop,
                    m: noop,
                    p: noop,
                };
            }
        `);
    });

    it('exposes an "init" partial', function () {
        const fragment = new Fragment('whatever');

        fragment.append(`doSomething()`, 'init');

        expect(fragment.render()).to.equalCode(`
            function noop(){}

            function whatever() {
                doSomething();
            
                return {
                    c: noop,
                    d: noop,
                    m: noop,
                    p: noop,
                };
            }
        `);
    });

    it('exposes a partial for each lifecycle hook', function () {
        const fragment = new Fragment('whatever');

        fragment.append('// create', 'create');
        fragment.append('// destroy', 'destroy');
        fragment.append('// mount', 'mount');
        fragment.append('// update', 'update');

        expect(fragment.render()).to.equalCode(`
            function whatever() {
                return {
                    c: function create() {
                        // create
                    },
                    d: function destroy() {
                        // destroy
                    },
                    m: function mount() {
                        // mount
                    },
                    p: function update() {
                        // update
                    },
                };
            }
        `);
    });
});