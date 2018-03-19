## acfun-article-spider (ACFUN文章区爬虫工具)



![license](https://img.shields.io/github/license/mashape/apistatus.svg)
[![npm](https://img.shields.io/badge/downloads-86-green.svg)](https://www.npmjs.com/package/acfun-article-spider)
[![npm](https://img.shields.io/badge/npm-v1.0.4-green.svg)](https://www.npmjs.com/package/acfun-article-spider)
[![Build Status](https://travis-ci.org/jeasonnow/ac_jieba.svg?branch=master)](https://travis-ci.org/jeasonnow/ac_jieba)




#### BASE
- node-fetch
- babel
- cheerio
- nodejieba
- yarn


#### HOW TO START
````javascript
npm install acfun-article-spider
```` 

#### API
- initArticleType （初始化文章区分类）
````javascript
var acArticleSpider = require('acfun-article-spider');
// 分类见以下：
// 游记、涂鸦、杂谈、美食、萌宠、自媒体、工作、情感、动漫杂谈、美图、漫画、文学、游戏杂谈、LOL、WOW、PUBG、炉石
acArticleSpider.initArticleType('杂谈');
````

- getKeywords (获取前十页所有文章的关键字并排序)
````javascript
var acArticleSpider = require('acfun-article-spider');
acArticleSpider.initArticleType('情感');
var articleInfoArrPromise = acArticleSpider.getKeywords();
articleInfoArrPromise.then(res => {
    console.log(res);
    /**
     * 此时的res获得的数据是一个<object array>
     * {
     *    keyword: '关键词',
     *    num: '次数'
     * }
    */
})
````

- getArticleInfoByPage (获取指定页数或者页数数组的文章的文章信息 *包含文章内容*)
````javascript
var acArticleSpider = require('acfun-article-spider');
acArticleSpider.initArticleType('情感');
var firstPageDataPromise = acArticleSpider.getArticleInfoByPage(1);
// 获取第一页的数据
var secondPageDataPromise = acArticleSpider.getArticleInfoByPage([1, 2]);
// 获取第一、二页的数据
firstPageDataPromise.then(res => {
    console.log(res);
    /**
     * 此时的数据是一个<object array>
     * {
     *  title: '文章标题',
     *  author: '文章作者',
     *  content: '文章内容',
     *  description: '文章描述',
     *  id: '文章id'，
     *  type: '文章类型'
     * }
    */
});
````

- getArticleIdByPage （获取指定页数或者页数数组的文章的文章id）
````javascript
var acArticleSpider = require('acfun-article-spider');
acArticleSpider.initArticleType('情感');
var firstPageDataIds = acArticleSpider.getArticleIdByPage(1);
// 获取第一页的文章ID
var secondPageIds= acArticleSpider.getArticleIdByPage([1, 2]);
// 获取前两页的文章ID
firstPageDataIds.then(res => {
    console.log(res);
    /**
     * 此时的数据是一个<number array>
     * [
     *  '文章id'
     * ]
    */
})
````

