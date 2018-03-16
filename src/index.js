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
    // log.log(`需要获取的是${pages.join(',')}页的文章`);        
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

/**
 * @param {*} keyWordArr
 * @returns {array} 排序后的关键词json数据
 */
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

    return result;
    // util.writeFile(outputFileName, JSON.stringify(result));
    // log.log(`bingo!已经输出至${outputFileName}，请及时查看统计数据`);
}

/**
 * @params none
 * {return} array 返回了前十页关键词
 */
async function getKeywords() {
    contentArr = await spiderArticleDetail(pages);
    keyWordArr = getKeyWordFromContent(contentArr);
    return processKeyWord(keyWordArr);
}

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
function getArticleInfoByPage(pageArr) {
    return new Promise(async (resolve, reject) => {
        let articleInfo = await spider.getArticleId(pageArr);
        let itemIndex = 0;
        let articleFullInfoArr = [];
        let getFunc = async () => {
            let content = await spider.getArticleDetail(articleInfo[itemIndex]["id"]);

            articleFullInfoArr.push(Object.assign({}, articleInfo[itemIndex], { content })); 


            if (itemIndex < articleInfo.length - 1) {
                itemIndex++;
                return getFunc();
            } else {
                resolve(articleFullInfoArr);
            }
        }

        getFunc();
    });
}

/**
 * 根据传入的页数或者页数数组，获取当前页数的文章ID
 * @param {*} pageArr 
 * @returns {array} 文章ID数组
 */
async function getArticleIdByPage(pageArr) {
    let articleInfo = await spider.getArticleId(pageArr);
    let idInfo = articleInfo.map((article) => { return article.id });

    return idInfo;
}

function initArticleType(type) {
    spider.initSpiderArticleType(type);
}

module.exports = {
    initArticleType,
    getKeywords,
    getArticleInfoByPage,
    getArticleIdByPage
};