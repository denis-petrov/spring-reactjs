module.exports = function follow(api, rootPath, relArray) {
    const root = api({
        method: 'GET',
        path: rootPath
    })

    return relArray.reduce((root, arrayItem) => {
        const rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel
        return traverseNext(root, rel, arrayItem)
    }, root)

    function traverseNext(root, rel, arrayItem) {
        return root.then(response => {
            if (hasEmbeddedRel(response.entity, rel)) {
                return response.entity._embedded[rel]
            }

            if (!response.entity._links) {
                return []
            }

            return typeof arrayItem === 'string' ? api({
                method: 'GET',
                path: response.entity._links[rel].href
            }) : api({
                method: 'GET',
                path: response.entity._links[rel].href,
                params: arrayItem.params
            });
        })
    }

    function hasEmbeddedRel(entity, rel) {
        return entity._embedded && entity._embedded.hasOwnProperty(rel)
    }
}