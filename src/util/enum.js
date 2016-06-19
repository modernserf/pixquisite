const id = (key) => key

export default function (keys, format = id) {
    return keys.reduce((obj, key) => {
        if (typeof key !== "string") {
            throw new Error("Enum id must be string")
        }
        if (obj[key]) { throw new Error("Duplicate key in enum") }
        obj[key] = format(key)
        return obj
    }, {})
}
