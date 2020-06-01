/** Parent Function for Archiving a Channel **/
exports.archiveChannel =  async function(channel){
    await fetchAllMessages(channel).then(r => {
        messageArrayToJSONArray(r).then(json => {
            let sortedJson = json.sort(function(a,b) {
                return a.timestamp - b.timestamp;
            });
            writeData(channel.parent.name, channel.name, sortedJson)
        }).catch(e=> {console.error(e)});
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
function writeData(categoryName, channelName, data){
    let dir = 'channelArchive/'+categoryName

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.writeFile(dir + '/' + channelName + ".json", JSON.stringify(data, null,4), function(){})
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
        message: message.content,
        timestamp: message.createdTimestamp,
        author: authorNickname
    }
}
