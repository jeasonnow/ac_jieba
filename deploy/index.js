'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var spiderArticleDetail = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(pages) {
        var contentArray;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _core2.default.getArticleId(pages);

                    case 2:
                        articleIds = _context.sent;
                        contentArray = fetchDetailFromId();
                        return _context.abrupt('return', contentArray);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function spiderArticleDetail(_x) {
        return _ref.apply(this, arguments);
    };
}();

var fetchDetailFromId = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var content;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _core2.default.getArticleDetail(articleIds[articleStackId]["id"]);

                    case 2:
                        content = _context2.sent;


                        contentArr.push(content);

                        if (!(articleStackId < articleIds.length - 1)) {
                            _context2.next = 9;
                            break;
                        }

                        articleStackId++;
                        return _context2.abrupt('return', fetchDetailFromId());

                    case 9:
                        return _context2.abrupt('return', contentArr);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function fetchDetailFromId() {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * @params none
 * {return} array 返回了前十页关键词
 */
var getKeywords = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return spiderArticleDetail(pages);

                    case 2:
                        contentArr = _context3.sent;

                        keyWordArr = getKeyWordFromContent(contentArr);
                        return _context3.abrupt('return', processKeyWord(keyWordArr));

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function getKeywords() {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * 
 * @param {*} pageArr 
 * @returns {promise} 
 * {
 *  title: 文章标题
 *  author: 作者,
 *  description: 描述,
 *  type: 文章类型,
 *  id: 文章Id,
 *  content: 文章内容
 * }
 */


/**
 * 根据传入的页数或者页数数组，获取当前页数的文章ID
 * @param {*} pageArr 
 * @returns {array} 文章ID数组
 */
var getArticleIdByPage = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(pageArr) {
        var articleInfo, idInfo;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return _core2.default.getArticleId(pageArr);

                    case 2:
                        articleInfo = _context6.sent;
                        idInfo = articleInfo.map(function (article) {
                            return article.id;
                        });
                        return _context6.abrupt('return', idInfo);

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function getArticleIdByPage(_x4) {
        return _ref6.apply(this, arguments);
    };
}();

var _core = require('./spider/core');

var _core2 = _interopRequireDefault(_core);

var _core3 = require('./jieba/core');

var _core4 = _interopRequireDefault(_core3);

var _core5 = require('./utils/core');

var _core6 = _interopRequireDefault(_core5);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var contentArr = [];
var keyWordStack = {};
var keyWordArr = [];
var articleStackId = 0;
var articleIds = void 0;

var outputFileName = _path2.default.join(__dirname, '..', 'dist', 'result-' + new Date().getTime() + '.json');

function getKeyWordFromContent(contentArr) {
    var keyWordArr = [];
    contentArr.forEach(function (content) {
        var keyword = _core4.default.getKeyword(content);
        keyWordArr.push(keyword);
    });

    return keyWordArr;
}

/**
 * @param {*} keyWordArr
 * @returns {array} 排序后的关键词json数据
 */
function processKeyWord(keyWordArr) {
    keyWordArr.forEach(function (keyWordArrItem) {
        keyWordArrItem.forEach(function (keyWordObj) {
            var keyWord = keyWordObj.word;
            if (!keyWordStack[keyWord]) {
                keyWordStack[keyWord] = 1;
            } else {
                keyWordStack[keyWord]++;
            }
        });
    });

    var result = Object.keys(keyWordStack).map(function (key) {
        return {
            keyword: key,
            num: keyWordStack[key]
        };
    }).sort(function (a, b) {
        return b.num - a.num;
    });

    return result;
    // util.writeFile(outputFileName, JSON.stringify(result));
    // log.log(`bingo!已经输出至${outputFileName}，请及时查看统计数据`);
}function getArticleInfoByPage(pageArr) {
    var _this = this;

    return new Promise(function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(resolve, reject) {
            var articleInfo, itemIndex, articleFullInfoArr, getFunc;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return _core2.default.getArticleId(pageArr);

                        case 2:
                            articleInfo = _context5.sent;
                            itemIndex = 0;
                            articleFullInfoArr = [];

                            getFunc = function () {
                                var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                                    var content;
                                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                                        while (1) {
                                            switch (_context4.prev = _context4.next) {
                                                case 0:
                                                    _context4.next = 2;
                                                    return _core2.default.getArticleDetail(articleInfo[itemIndex]["id"]);

                                                case 2:
                                                    content = _context4.sent;


                                                    articleFullInfoArr.push(Object.assign({}, articleInfo[itemIndex], { content: content }));

                                                    if (!(itemIndex < articleInfo.length - 1)) {
                                                        _context4.next = 9;
                                                        break;
                                                    }

                                                    itemIndex++;
                                                    return _context4.abrupt('return', getFunc());

                                                case 9:
                                                    resolve(articleFullInfoArr);

                                                case 10:
                                                case 'end':
                                                    return _context4.stop();
                                            }
                                        }
                                    }, _callee4, _this);
                                }));

                                return function getFunc() {
                                    return _ref5.apply(this, arguments);
                                };
                            }();

                            getFunc();

                        case 7:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this);
        }));

        return function (_x2, _x3) {
            return _ref4.apply(this, arguments);
        };
    }());
}

function initArticleType(type) {
    _core2.default.initSpiderArticleType(type);
}

module.exports = {
    initArticleType: initArticleType,
    getKeywords: getKeywords,
    getArticleInfoByPage: getArticleInfoByPage,
    getArticleIdByPage: getArticleIdByPage
};