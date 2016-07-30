import mockery from 'mockery';
import Promise from 'bluebird';
import { expect } from 'chai';

const filePrefix = process.env.PWD;
const accessToken = process.env.FACEBOOK_FANSPAGE_ACCESS_TOKEN;
const mockedData = require(`${filePrefix}/test/lib/utils/mocks`);
const mockSuccessData = mockedData.successData;
const mockFailureData = mockedData.failureData;

let markSeen;
let loaderStart;
let loaderEnd;
let sendTextMessage;
let parseReq;

before(() => {
    const mockedRequest = (data, callback) => {
        if (data.json.recipient.id === mockSuccessData.senderId) {
            return callback(null, data);
        }
        return callback(mockFailureData);
    };
    mockery.enable({
        useCleanCache: true,
        warnOnReplace: true,
        warnOnUnregistered: false,
    });
    mockery.registerMock('request', mockedRequest);

    const fbBot = require(`${filePrefix}/lib/utils/fbBot`);
    [markSeen, loaderStart, loaderEnd, sendTextMessage, parseReq] = [
        fbBot.markSeen,
        fbBot.loaderStart,
        fbBot.loaderEnd,
        fbBot.sendTextMessage,
        fbBot.parseReq,
    ];
});

after(() => {
    mockery.disable();
    mockery.deregisterAll();
});

describe('#fbBot', () => {
    it('should send mark seen successfully', () => {
        const { senderId } = mockSuccessData;

        return markSeen(senderId)
            .then(response => Promise.all([
                expect(response).to.have.property('url'),
                expect(response).to.have.deep.property('qs.access_token', accessToken),
                expect(response).to.have.property('method', 'POST'),
                expect(response).to.have.deep.property('json.recipient.id', senderId),
                expect(response).to.have.deep.property('json.sender_action', 'mark_seen'),
            ]));
    });

    it('should receive error when mark seen failure', () => {
        return markSeen()
            .catch(error => Promise.all([
                expect(error).to.have.property('errorMessage', mockFailureData.errorMessage),
            ]));
    });

    it('should send loader start successfully', () => {
        const { senderId } = mockSuccessData;

        return loaderStart(senderId)
            .then(response => Promise.all([
                expect(response).to.have.property('url'),
                expect(response).to.have.deep.property('qs.access_token', accessToken),
                expect(response).to.have.property('method', 'POST'),
                expect(response).to.have.deep.property('json.recipient.id', senderId),
                expect(response).to.have.deep.property('json.sender_action', 'typing_on'),
            ]));
    });

    it('should receive error when start loader failure', () => {
        return loaderStart()
            .catch(error => Promise.all([
                expect(error).to.have.property('errorMessage', mockFailureData.errorMessage),
            ]));
    });

    it('should send loader end successfully', () => {
        const { senderId } = mockSuccessData;

        return loaderEnd(senderId)
            .then(response => Promise.all([
                expect(response).to.have.property('url'),
                expect(response).to.have.deep.property('qs.access_token', accessToken),
                expect(response).to.have.property('method', 'POST'),
                expect(response).to.have.deep.property('json.recipient.id', senderId),
                expect(response).to.have.deep.property('json.sender_action', 'typing_off'),
            ]));
    });

    it('should receive error when end loader failure', () => {
        return loaderEnd()
            .catch(error => Promise.all([
                expect(error).to.have.property('errorMessage', mockFailureData.errorMessage),
            ]));
    });

    it('should send text messenger successfully', () => {
        const { senderId, text } = mockSuccessData;

        return sendTextMessage(senderId, text)
            .then(response => Promise.all([
                expect(response).to.have.property('url'),
                expect(response).to.have.deep.property('qs.access_token', accessToken),
                expect(response).to.have.property('method', 'POST'),
                expect(response).to.have.deep.property('json.recipient.id', senderId),
                expect(response).to.have.deep.property('json.message.text', text),
            ]));
    });

    it('should receive error when send text messenger failure', () => {
        return sendTextMessage()
            .catch(error => Promise.all([
                expect(error).to.have.property('errorMessage', mockFailureData.errorMessage),
            ]));
    });

    it('should parse request if request format is correct', done => {
        const { req } = mockSuccessData;
        const data = parseReq(req);

        expect(data).to.have.property('senderId');
        expect(data).to.have.property('text');

        done();
    });

    it('should parse request failure if request format is wrong', done => {
        const data = parseReq();

        expect(data).to.be.empty;
        
        done();
    });
});
