'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodejieba = require('nodejieba');

var _nodejieba2 = _interopRequireDefault(_nodejieba);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOP_NUMBER = 3;

exports.default = {
    getKeyword: function getKeyword(content) {
        // 此处使用默认字典
        var keyWordsArray = _nodejieba2.default.extract(content, TOP_NUMBER);
        return keyWordsArray;
    },
    extraDict: function extraDict(dictPath) {
        _nodejieba2.default.load({
            userDict: dictPath
        });
    }
};