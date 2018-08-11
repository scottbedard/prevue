export type NodeType = 'element' | 'text' | 'unknown';

export interface SerializedNode {
    children: Array<SerializedNode> | null,
    nodeType: NodeType,
    tagName: string | null,
    textContent: string | null,
}
