const consumeApi = async (sentence) => {
    const hitAPI = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${sentence}`)
        // convert promise to plain text which will either return true or false
    return await hitAPI.text();
}

module.exports = consumeApi;