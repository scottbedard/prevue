export interface SerializedElement {
    children: Array<SerializedElement>,
    tagName: string,
    textContent: string | null,
}