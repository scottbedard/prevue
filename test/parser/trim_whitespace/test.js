module.exports.options = {
    trimWhitespace: true,
}

module.exports.expected = {
    template: {
        "children": [
            {
                "children": [
                    {
                        "children": null,
                        "nodeType": "text",
                        "tagName": null,
                        "textContent": "Hello world"
                    }
                ],
                "nodeType": "element",
                "tagName": "span",
                "textContent": null
            }
        ],
        "nodeType": "element",
        "tagName": "div",
        "textContent": null
    }
}