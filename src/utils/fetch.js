const fetch = require('node-fetch');
const cheerio = require("cheerio");

function detectRes(type) {
    let resStack = {
        'buffer': (res) => {
            return res.buffer()
        },
        'text': (res) => {
            return res.text()
        },
        'json': (res) => {
            return res.json()
        },
        'default': (res) => {
            return res;
        }
    }

    return resStack[type];
}

function donwloadPageData(url, type) {
    type = type || 'text';
    return new Promise ((resolve, reject) => {
        return fetch(url)
            .then((res) => {
                return detectRes(type)(res);
            })
            .then((body) => {
                resolve(body);
            })
            .catch((err) => {
                reject(err);
            });
    })
}

module.exports = {
    donwloadPageData
}