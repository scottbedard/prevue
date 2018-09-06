import Compiler from 'src/compiler/compiler';
import Fragment from 'src/compiler/fragment';
import { FragmentProcessor, SerializedNode } from 'src/types';
import { isElementNode } from 'src/utils/serialized_node';

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

        const elementVar = fragment.getNamedIdentifier(<string> node.tagName);

        fragment.append(`let ${elementVar};`, 'init');
    },

    /**
     * Determine if this node requires a new fragment context.
     * 
     * @param  {SerializedNode} node
     * @return {false | string}
     */
    requiresNewFragment(node: SerializedNode): false | string {
        return false;
    },
};