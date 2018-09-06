import { SerializedNode } from "../types";

/**
 * Determine if a node is an element node.
 * 
 * @param  {SerializedNode} node
 * @return {boolean} 
 */
export function isElementNode(node: SerializedNode): boolean {
    return node.nodeType === 'element';
}

/**
 * Determine if a node is a text node.
 * 
 * @param  {SerializedNode} node
 * @return {boolean} 
 */
export function isTextNode(node: SerializedNode): boolean {
    return node.nodeType === 'text';
}