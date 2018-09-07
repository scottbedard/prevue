import Compiler from 'src/compiler/compiler';
import Fragment from 'src/compiler/fragment';
import { FragmentProcessor, SerializedNode } from 'src/types';
import { isElementNode } from 'src/utils/serialized_node';
import { notDeepEqual } from 'assert';

export const elementProcessor: FragmentProcessor = {

    /**
     * Process the current node.
     * 
     * @param  {Compiler}       compiler
     * @param  {Fragment}       fragment
     * @param  {SerializedNode} node
     * @return {void}
     */
    process(compiler: Compiler, fragment: Fragment, node: SerializedNode): void {
        // do nothing if something other than an element is being processed
        if (!isElementNode(node)) {
            return;
        }

        // init
        // define a variable for the element
        const el = fragment.generateNamedIdentifier(<string> node.tagName);
        fragment.append(`let ${el};`, 'init');

        // create
        // instantiate the element and assign it to our variable
        fragment.append(`${el} = @createElement('${node.tagName}');`, 'create');

        // mount
        // insert our element into the dom
        fragment.append(`@insert(target, ${el}, anchor);`, 'mount');

        // @todo: update

        // @todo: destroy
    },

    /**
     * Determine if this node requires a new fragment context.
     * 
     * @param  {SerializedNode} node
     * @return {false | string}
     */
    requiresNewFragment(node: SerializedNode): false | string {
        // return false for conditions where a new fragment is not required
        if (node.isRoot || !isElementNode(node)) {
            return false;
        }

        // @todo: find conditions where a new fragment is necessary
        return false;
    },
};