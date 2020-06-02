resolve = require('path').resolve
normalize = require('path').normalize

/** Parent Function for Archiving a Channel **/
exports.archiveChannel =  async function(channel){
    await fetchAllMessages(channel).then( async(r) => {
       await messageArrayToJSONArray(r).then(async (json) => {
            let sortedJson = json.sort(function(a,b) {
                return a.timestamp - b.timestamp;
            });
            await writeData(channel.parent.name, channel.name, sortedJson);
        }).catch(e=> {console.error(e)});
    });
}

exports.sendArchive = function(origMessage,channelName, categoryName){
    let filePath = resolve('channelArchive/'+categoryName + "/" + channelName + ".json");
    origMessage.author.send({files: [{attachment: filePath , name:channelName+".json"}]}).then(r=>{}).catch(e => {
        origMessage.author.send("Hi!\n The Archive of "+channelName +" was successful, however I was unable to send it for some reason.\n Please check my server for the files you are looking for. \nThanks!")
    });
}


//Fetches all the messages for a channel
async function fetchAllMessages(channel) {
    const all_messages = [];
    let last_id;

    while (true) {
        const options = {limit: 100}

        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.fetchMessages(options);
        all_messages.push(...messages.array());

        last_id = messages.last().id

        if(messages.size !== 100){
            break;
        }

    }
    return all_messages;
}

//Writes data to a json file in the category folder.
async function writeData(categoryName, channelName, data) {
    let dir = 'channelArchive/' + categoryName

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let filePath = dir + '/' + channelName + ".json";

    await fs.writeFile(filePath, JSON.stringify(data, null, 4), function () {
    })
    return filePath;
}

//Creates an Array of JSON message entries form the Message array
async function messageArrayToJSONArray(messagesArray){
    let messagesJson = []
    for (const m of messagesArray) {
        await createJsonFromMessage(m).then(k=>{messagesJson.push(k)}).catch(e => console.error(e))
    }

    return messagesJson;
}

//Create a JSON entry from the message object
async function createJsonFromMessage(message){

    let authorNickname = "unknown user"

    await message.guild.fetchMember(message.author).then(r => {authorNickname = r.displayName}).catch(e=>console.error(e))


    return {
        author: authorNickname,
        message: message.content,
        timestamp: message.createdTimestamp
    }
}
