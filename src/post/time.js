//
// Handles post timing system for timed messages.
//

let client;

exports.init = function (_client) {
    client = _client;
    client.setTimeout(timeout, (60 - new Date().getSeconds()) * 1000);
};

function inter() {
    client.channels.get('648688174620606524').send('the minute changed');
}

function timeout() {

    inter();

    client.setInterval(inter, 60000);

}