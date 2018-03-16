'use strict';

var fetch = require('node-fetch');
var cheerio = require("cheerio");

function detectRes(type) {
    var resStack = {
        'buffer': function buffer(res) {
            return res.buffer();
        },
        'text': function text(res) {
            return res.text();
        },
        'json': function json(res) {
            return res.json();
        },
        'default': function _default(res) {
            return res;
        }
    };

    return resStack[type];
}

function donwloadPageData(url, type) {
    type = type || 'text';
    return new Promise(function (resolve, reject) {
        return fetch(url).then(function (res) {
            return detectRes(type)(res);
        }).then(function (body) {
            resolve(body);
        }).catch(function (err) {
            reject(err);
        });
    });
}

module.exports = {
    donwloadPageData: donwloadPageData
};