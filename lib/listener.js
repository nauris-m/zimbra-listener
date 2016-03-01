'use strict';

let _ = require('lodash');
let co = require("co");
let request = require("co-request");
let socket = require('socket.io-client')('http://youraddress:3000');

let config = require('../config');

let options = {
    auth: {
        user: config.credentials.username,
        pass: config.credentials.password
    }
};

socket.on('New Mail Item', function (msg) {
    co(loadMail(msg.id))
        .then(mailBody => {
            console.log('new mail received: ', mailBody);
            parseBodyContent(mailBody);
        })
        .catch(err => console.err(err));
});

function parseBodyContent(mailBody) {
    let body = JSON.parse(mailBody);
    console.log(mailBody);
}

let loadMail = function * (id) {
    options.url = `https://zimbra.site.com/home/~/?id=${id}&fmt=json`;
    let result = yield request(options);
    return result.body;
};

socket.on('connect', function () {
    console.log('connected');
});

socket.on('disconnect', function () {
    console.log('disconnected');
});