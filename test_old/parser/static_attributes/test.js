module.exports.expected = {
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

module.exports.test = function(output) {
    expect(Object.keys(output.template.staticAttrs).length).toBe(2);
}