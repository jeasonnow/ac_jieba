'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _fetch = require('../utils/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ARTICLE_LIST_URL = 'http://webapi.aixifan.com/query/article/list?';
var ARTICLE_DETAIL_URL_PREFIX = 'http://www.acfun.cn/a/ac';
var CONTENT_CLASS = '.article-content';
var REAL_MIDS = [{
    name: '游记',
    type: 17
}, {
    name: '涂鸦',
    type: 18
}, {
    name: '杂谈',
    type: 5
}, {
    name: '美食',
    type: 1
}, {
    name: '萌宠',
    type: 2
}, {
    name: '自媒体',
    type: 4
}, {
    name: '工作',
    type: 6
}, {
    name: '情感',
    type: 7
}, {
    name: '动漫杂谈',
    type: 13
}, {
    name: '美图',
    type: 14
}, {
    name: '漫画',
    type: 15
}, {
    name: '文学',
    type: 16
}, {
    name: '游戏杂谈',
    type: 8
}, {
    name: 'LOL',
    type: 11
}, {
    name: 'WOW',
    type: 10
}, {
    name: 'PUBG',
    type: 9
}, {
    name: '炉石',
    type: 12
}];

// 默认显示文章区
var articleType = 7;

// 通过爬取每一页的数据获得当前页面的所有获取数据的promise
// input: page 页数
// output: promise 获取当前页数的数据结果
function fetchInfoFromAcfun(page) {
    var _this = this;

    var similarConfig = {
        json: true,
        headers: {
            "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            "Accept-Encoding": 'gzip, deflate',
            "Accept-Language": 'zh-CN,zh;q=0.9',
            "Cache-Control": 'max-age=0',
            "Connection": 'keep-alive',
            "Host": 'webapi.aixifan.com',
            "If-Modified-Since": 'Mon, 26 Feb 2018 07:18:49 GMT',
            "If-None-Match": "58d406aa-d188-4f10-8d46-fdacc889f864",
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
        }
    };

    return new Promise(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
            var requestBody;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            requestBody = 'pageNo=' + page + '&size=10&realmIds=' + articleType + '&originalOnly=false&orderType=1&periodType=-1&filterTitleImage=true';


                            _fetch2.default.donwloadPageData('' + ARTICLE_LIST_URL + requestBody, 'json').then(function (res) {
                                resolve(res);
                            }, function (e) {
                                reject(e);
                            });

                        case 2:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
}

// 根据id获取当前页面的html结构文档
// input: id 文章id
// output: promise 获取当前页面文档结果的Promise
function fetchPageBodyById(id) {
    return new Promise(function (resolve, reject) {
        _fetch2.default.donwloadPageData('' + ARTICLE_DETAIL_URL_PREFIX + id, 'text').then(function (res) {
            resolve(res);
        }, reject);
    });
}

// 获取当前文章页面的文章内容
// input: html结构
// output: content 文章内容
function getDetailString(html) {
    var $ = _cheerio2.default.load(html);
    var content = $(CONTENT_CLASS).text().replace(/<\/?.+?>/g, "").replace(/ /g, "");

    return content;
}

/**
 * api: 
 * 1. initSpiderArticleType 初始化文章分类默认情感区
 * 2. getArticleId {function} 获取对应页数的文章id 返回的是promise
 * 3. getArticleDetail {function} 获取对应id文章内容 返回的是一个promise
 */
exports.default = {
    initSpiderArticleType: function initSpiderArticleType(name) {
        REAL_MIDS.forEach(function (idInfo) {
            if (name === idInfo.name) {
                articleType = idInfo.type;
            }
        });
    },
    getArticleId: function getArticleId(pages) {
        var getArticlePromiseStack = [];
        var articleIds = [];
        if (Array.isArray(pages)) {
            pages.forEach(function (page) {
                var currentPageGetArticle = fetchInfoFromAcfun(page);
                getArticlePromiseStack.push(currentPageGetArticle);
            });
        } else {
            var currentPageGetArticle = fetchInfoFromAcfun(pages);
            getArticlePromiseStack.push(currentPageGetArticle);
        }

        return new Promise(function (resolve, reject) {
            Promise.all(getArticlePromiseStack).then(function (resArr) {
                resArr.forEach(function (res) {
                    var articleList = res.data.articleList;
                    articleList.forEach(function (article) {
                        var articleInfo = {};
                        articleInfo.title = article.title;
                        articleInfo.author = article.username;
                        articleInfo.description = article.description;
                        articleInfo.type = article.realm_name;
                        articleInfo.id = article.id;

                        articleIds.push(articleInfo);
                    });
                });
                resolve(articleIds);
            }, function (err) {
                reject(err);
            });
        });
    },

    getArticleDetail: function getArticleDetail(id) {
        return new Promise(function (resolve, reject) {
            fetchPageBodyById(Number(id)).then(function (res) {
                var content = getDetailString(res);
                resolve(content);
            }, reject);
        });
    }
};