'use strict';

var _core = require('./core.js');

var _core2 = _interopRequireDefault(_core);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACS_PACKAGE_JSON_PATH = _path2.default.join(__dirname, '..', '..', 'deploy', 'package.json');

function updatePackgeJson() {
    var acsPackageJson = _core2.default.readJsonFile(ACS_PACKAGE_JSON_PATH);
    var preVersion = acsPackageJson.version;
    var versionArr = preVersion.split('.');
    if (versionArr[2] < 9) {
        versionArr[2]++;
    } else {
        versionArr[0]++;
    }

    var newVersion = versionArr.join('.');

    acsPackageJson.version = newVersion;

    _core2.default.writeFile(ACS_PACKAGE_JSON_PATH, JSON.stringify(acsPackageJson));
}

updatePackgeJson();