export const expected = {
    "template": {
        "children": [],
        "nodeType": "element",
        "staticAttrs": {
            "one": "two",
            "three": "four"
        },
        "tagName": "div",
        "textContent": null
    }
}

export function test(output) {
    expect(Object.keys(output.template.staticAttrs).length).toBe(2);
}