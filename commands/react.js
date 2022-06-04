const addreaction = (message,reaction) => {
    client.messages.addReaction(reaction[0])
    reaction.shift()
    if (reaction.length > 0){
        setTimeout(() => addreaction(message,reaction),750
        )
    }
}
module.exports = async (client,id,reaction = []) => {

    client.users.fetch(id).then((message) => {
        addreaction(message,reaction)
    })
}