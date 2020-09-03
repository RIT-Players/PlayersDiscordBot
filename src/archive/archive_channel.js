resolve = require('path').resolve
normalize = require('path').normalize
const logger = require("../logging.js").logger;

/** Parent Function for Archiving a Channel **/
exports.archiveChannel =  async function(channel, origMessage){
    logger.info("Archiving Channel " + channel.name)
    await fetchAllMessages(channel).then( async(r) => {
       await messageArrayToJSONArray(r,channel).then(async (json) => {
            await writeData(channel.parent.name, channel.name, json);
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

        if(messages.last()){
            last_id = messages.last().id
        }

        if(messages.size !== 100){
            break;
        }

    }
    return all_messages;
}

//Writes data to a json file in the category folder.
async function writeData(categoryName, channelName, data) {
    if(!fs.existsSync('channelArchive/')){
        fs.mkdirSync('channelArchive');
    }

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
async function messageArrayToJSONArray(messagesArray, channel){
    let messagesJson = []
    for (const m of messagesArray) {
        messagesJson.push(createJsonFromMessage(m));
    }

    messagesJson.sort(function(a,b) {
        return new Date(a.timestamp) - new Date(b.timestamp);
    });

    return {
        metadata: {
            channelName: channel.name,
            categoryName: channel.parent.name,
            serverName: channel.guild.name,
            channelCreated: (new Date(channel.createdTimestamp)).toString(),
            archiveCreated: (new Date()).toString(),
        },
        messages: messagesJson};
}

//Create a JSON entry from the message object
function createJsonFromMessage(message){
    let author = message.guild.member(message.author);
    let displayName = "Unknown Author";
    if(author){
        displayName = author.displayName;
    }
    return {
        author: displayName,
        message: message.content,
        timestamp: (new Date(message.createdTimestamp)).toString()
    }
}
