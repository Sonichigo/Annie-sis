const mongo = require("../Database/mongo.js")
const messageCountSchema = require("../schema/message-count.js")

module.exports = (client) => {
    client.on('message',async (message) => {
        const {author} = message
        const {id} = author
        await mongo().then( async (mongoose) => {
            try{
                await messageCountSchema.findOneAndUpdate(
                    {
                      _id: id,
                    },
                    {
                      $inc: {
                        messageCount: 1,
                      },
                    },
                    {
                      upsert: true,
                    }
                  ).exec()
            }finally{
                mongoose.connection.close()
            }
        })
    })
}