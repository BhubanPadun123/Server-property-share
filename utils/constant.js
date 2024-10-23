const JsonParse=(data)=> {
    try {
        return JSON.parse(data)
    } catch (error) {
        return null
    }
}
const ObjectStringfy=(data)=> {
    try {
        return JSON.stringify(data)
    } catch (error) {
        return null
    }
}

module.exports ={
    JsonParse,
    ObjectStringfy
}