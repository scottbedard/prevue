import Compiler from 'src/compiler/compiler';
import Fragment from 'src/compiler/fragment';

// compilation options
export interface CompilerOptions {
    cleanOutput?: boolean,
    format: 'fn',
    name: string,
    trimWhitespace?: boolean,
}

// compilation output
export interface CompilerOutput {
    code: string,
}

// fragment processor
export interface FragmentProcessor {
    process: (compiler: Compiler, fragment: Fragment, node: SerializedNode) => void,
    requiresNewFragment: (node: SerializedNode) => false | string,
}

// constructable types
export interface Constructable<T> {
    new() : T;
}

// dynamic node attributes
export interface NodeDynamicAttrs {
    [key: string]: {
        // @todo: flesh this out
        rawValue: string,
    },
}

// static node attributes
export interface NodeStaticAttrs {
    [key: string]: string
}

// the various types of elements that can be serialized
export type NodeType = 'element' | 'text' | 'unknown';

// output from the parser
export interface ParsedSource {
    template: SerializedNode,
}

// the first part of our compilation process is to serialize the
// template. this interfaces represents the shape of thot serialization.
export interface SerializedNode {
    children: Array<SerializedNode>,
    dynamicAttrs: NodeDynamicAttrs,
    isRoot: boolean,
    nodeType: NodeType,
    staticAttrs: NodeStaticAttrs | null,
    tagName: string | null,
    textContent: string | null,
}
