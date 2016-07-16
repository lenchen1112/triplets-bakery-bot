const router = require('koa-route');
const { parseReq, markSeen, loaderStart,
        loaderEnd, sendTextMessage } = require('../lib/utils/fbBot');

const verifyToken = process.env.VERIFY_TOKEN;

module.exports.fbVerify = router.get('/facebook/verifyToken', function* fbVerify() {
    if (this.query['hub.verify_token'] === verifyToken) {
        this.body = this.query['hub.challenge'];
    } else {
        this.body = 'Wrong validation token';
    }
});

module.exports.fbReply = router.post('/facebook/*', function* reply() {
    const parsedData = parseReq(this.request);
    const senderId = parsedData.senderId;
    const echoText = parsedData.text;

    yield markSeen(senderId)
          .then(loaderStart(senderId))
          .then(sendTextMessage(senderId, echoText))
          .then(loaderEnd(senderId))
          .catch(error => console.log(error));

    this.status = 200;
});
