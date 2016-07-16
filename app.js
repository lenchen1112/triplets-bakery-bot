require('dotenv').config();

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const koa = require('koa');
const app = koa();
const { fbVerify, fbReply } = require('./routes/facebookEntry');

// app property
app.name = 'triplets-bakery-facebook-bot';

// logger should be the top of middlewares
app.use(logger());

app.use(bodyParser({
    enableTypes: ['json', 'urlencoded'],
}));

// routing
app.use(fbVerify);
app.use(fbReply);

app.listen(3000);
