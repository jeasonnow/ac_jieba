import util from '../utils/fetch';
import cheerio from 'cheerio';

const ARTICLE_LIST_URL = 'http://webapi.aixifan.com/query/article/list?';
const ARTICLE_DETAIL_URL_PREFIX = 'http://www.acfun.cn/a/ac';
const CONTENT_CLASS = '.article-content';

// 通过爬取每一页的数据获得当前页面的所有获取数据的promise
// input: page 页数
// output: promise 获取当前页数的数据结果
function fetchInfoFromAcfun(page) {
    let similarConfig = {
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

    return new Promise(async (resolve, reject) => {
        
        let requestBody = `pageNo=${page}&size=10&realmIds=7&originalOnly=false&orderType=1&periodType=-1&filterTitleImage=true`;


        util.donwloadPageData(`${ARTICLE_LIST_URL}${requestBody}`, 'json').then((res) => {
            resolve(res);
        }, (e) => {
            reject(e);
        });      
    })
}

// 根据id获取当前页面的html结构文档
// input: id 文章id
// output: promise 获取当前页面文档结果的Promise
function fetchPageBodyById(id) {
    return new Promise((resolve, reject) => {
        util.donwloadPageData(`${ARTICLE_DETAIL_URL_PREFIX}${id}`, 'text').then((res) => {
            resolve(res);
        }, reject)
    });
}

// 获取当前文章页面的文章内容
// input: html结构
// output: content 文章内容
function getDetailString(html) {
    let $ = cheerio.load(html);
    let content = $(CONTENT_CLASS).text().replace(/<\/?.+?>/g,"").replace(/ /g,"");

    return content;
}

/**
 * api: 
 * 1. getArticleId {function} 获取对应页数的文章id 返回的是promise
 * 2. getArticleDetail {function} 获取对应id文章内容 返回的是一个promise
 */
export default {
    getArticleId: (pages) => {
        let getArticlePromiseStack = [];
        let articleIds = [];
        if (Array.isArray(pages)) {
            pages.forEach((page) => {
                let currentPageGetArticle = fetchInfoFromAcfun(page);
                getArticlePromiseStack.push(currentPageGetArticle); 
            });
        } else {
            let currentPageGetArticle = fetchInfoFromAcfun(pages);
            getArticlePromiseStack.push(currentPageGetArticle); 
        }

        

        return new Promise((resolve, reject) => {
            Promise.all(getArticlePromiseStack).then((resArr) => {
                resArr.forEach((res) => {
                    let articleList = res.data.articleList;
                    articleList.forEach((article) => {
                        let articleInfo = {};
                        articleInfo.title = article.title;
                        articleInfo.author = article.username;
                        articleInfo.description = article.description;
                        articleInfo.type = article.realm_name;
                        articleInfo.id = article.id;
    
                        articleIds.push(articleInfo);
                    });
                });
                resolve(articleIds);
            }, (err) => {
                reject(err);
            });
        });
    },

    getArticleDetail: (id) => {
        return new Promise((resolve, reject) => {
            fetchPageBodyById(Number(id)).then((res) => {
                let content = getDetailString(res);
                resolve(content);
            }, reject);
        })
    }
}