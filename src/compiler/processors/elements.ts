import Compiler from 'src/compiler/compiler';
import Fragment from 'src/compiler/fragment';
import { FragmentProcessor, SerializedNode } from 'src/types';

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