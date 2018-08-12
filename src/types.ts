// compilation options
export interface CompilerOptions {
    trimWhitespace?: boolean,
}

// the various types of elements that can be serialized
export type NodeType = 'element' | 'text' | 'unknown';

// the first part of our compilation process is to serialize the
// template. this interfaces represents the shape of thot serialization.
export interface SerializedNode {
    children: Array<SerializedNode> | null,
    nodeType: NodeType,
    tagName: string | null,
    textContent: string | null,
}
