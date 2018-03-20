import core from './core.js';
import path from 'path';

const ACS_PACKAGE_JSON_PATH = path.join(__dirname, '..', '..', 'deploy', 'package.json');

function updatePackgeJson() {
    let acsPackageJson = core.readJsonFile(ACS_PACKAGE_JSON_PATH);
    let preVersion = acsPackageJson.version;
    let versionArr = preVersion.split('.');
    if(versionArr[2] < 9) {
        versionArr[2]++;
    } else {
        if (versionArr[1] < 9) {
            versionArr[1]++;
            versionArr[2] = 0;
        } else {
            versionArr[1] = 0;
            versionArr[2] = 0;
            versionArr[0]++; 
        }
    }

    let newVersion = versionArr.join('.');

    acsPackageJson.version = newVersion;

    core.writeFile(ACS_PACKAGE_JSON_PATH, JSON.stringify(acsPackageJson));
}

updatePackgeJson();
  