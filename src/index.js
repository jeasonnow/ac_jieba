import spider from './spider/core';
import jieba from './jieba/core';
import util from './utils/core';
import log from './utils/log';
import path from 'path';

let pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let contentArr = [];
let keyWordStack = {};
let keyWordArr = [];
let articleStackId = 0;
let articleIds;

let outputFileName = path.join(__dirname, '..', 'dist', `result-${new Date().getTime()}.json`);

async function spiderArticleDetail(pages) {
    log.log(`需要获取的是${pages.join(',')}页的文章`);        
    articleIds = await spider.getArticleId(pages);
    let contentArray = fetchDetailFromId();

    return contentArray;
}

async function fetchDetailFromId() {
    let content = await spider.getArticleDetail(articleIds[articleStackId]["id"]);

    contentArr.push(content);

    if (articleStackId < articleIds.length - 1) {
        articleStackId++;
        return fetchDetailFromId();
    } else {
        return contentArr;
    }
}

function getKeyWordFromContent(contentArr) {
    let keyWordArr = [];
    contentArr.forEach((content) => {
        let keyword = jieba.getKeyword(content);
        keyWordArr.push(keyword);
    });

    return keyWordArr;
}

function processKeyWord(keyWordArr) {
    keyWordArr.forEach((keyWordArrItem) => {
        keyWordArrItem.forEach((keyWordObj) => {
            let keyWord = keyWordObj.word;
            if (!keyWordStack[keyWord]) {
                keyWordStack[keyWord] = 1;
            } else {
                keyWordStack[keyWord]++;
            }
        });
    })

    let result = Object.keys(keyWordStack).map((key) => {
        return {
            keyword: key,
            num: keyWordStack[key]
        }
    }).sort((a, b) => { return b.num - a.num });

    util.writeFile(outputFileName, JSON.stringify(result));

    log.log(`bingo!已经输出至${outputFileName}，请及时查看统计数据`);
}

async function go() {
    contentArr = await spiderArticleDetail(pages);
    keyWordArr = getKeyWordFromContent(contentArr);
    processKeyWord(keyWordArr);
}

go();
