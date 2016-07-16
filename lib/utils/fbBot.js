const request = require('request');
const Promise = require('bluebird');

const accessToken = process.env.FACEBOOK_FANSPAGE_ACCESS_TOKEN;
const FB_URL = 'https://graph.facebook.com/v2.6/me/messages';

const sendMessage = (messageData, callback) => request({
    url: FB_URL,
    qs: {
        access_token: accessToken,
    },
    method: 'POST',
    json: messageData,
}, callback);

exports.markSeen = senderId => (
    new Promise((resolve, reject) =>
        sendMessage({
            recipient: {
                id: senderId,
            },
            sender_action: 'mark_seen',
        }, (err, res) =>
            (err ? reject(err) : resolve(res))
        )
    )
);

exports.loaderStart = senderId => (
    new Promise((resolve, reject) =>
        sendMessage({
            recipient: {
                id: senderId,
            },
            sender_action: 'typing_on',
        }, (err, res) =>
            (err ? reject(err) : resolve(res))
        )
    )
);

exports.loaderEnd = senderId => (
    new Promise((resolve, reject) =>
        sendMessage({
            recipient: {
                id: senderId,
            },
            sender_action: 'typing_off',
        }, (err, res) =>
            (err ? reject(err) : resolve(res))
        )
    )
);

exports.sendTextMessage = (senderId, text) => (
    new Promise((resolve, reject) =>
        sendMessage({
            recipient: {
                id: senderId,
            },
            message: {
                text,
            },
        }, (err, res) =>
            (err ? reject(err) : resolve(res))
        )
    )
);

exports.parseReq = req => {
    const data = req.body;
    const returnData = {};

    if (data.object === 'page') {
        data.entry.forEach(pageEntry =>
            pageEntry.messaging.forEach(messagingEvent => {
                returnData.senderId = messagingEvent.sender.id;
                returnData.text = messagingEvent.message.text;
            }
        ));
    }

    return returnData;
};
