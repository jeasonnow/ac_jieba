## acfun-article-spider (ACFUN文章区爬虫工具)

#### BASE
- node-fetch
- babel (使用async/awat进行异步操作)
- cheerio
- nodejieba
- yarn

#### API
- initArticleType （初始化文章区分类）
````javascript
var acArticleSpider = require('acfun-article-spider');
// 此处的分类参照acfun文章区
// 游记、涂鸦、杂谈、美食、萌宠、自媒体、工作、情感、动漫杂谈、美图、漫画、文学、游戏杂谈、LOL、WOW、PUBG、炉石
acArticleSpider.initArticleType('杂谈');
// 初始化分类之后acArticleSpider获取的内容将来自于该分类之下
// 未初始化的话，分类默认为情感
````

- getKeywords (获取前十页所有文章的关键字并排序)
````javascript
var acArticleSpider = require('acfun-article-spider');
acArticleSpider.initArticleType('情感');
var articleInfoArr = acArticleSpider.getKeywords();
// 此时的articleInfoArr就是文章信息数组了
````

- getArticleInfoByPage (获取指定页数或者页数数组的文章的文章信息 *包含文章内容*)
````javascript
var acArticleSpider = require('acfun-article-spider');
acArticleSpider.initArticleType('情感');
var firstPageDataPromise = acArticleSpider.getArticleInfoByPage(1);
// 获取第一页的数据
var secondPageDataPromise = acArticleSpider.getArticleInfoByPage([1, 2]);
// 获取前两页的数据
// 这个方法回传的数据是一个promise，请遵照promise操作规范处理
// 此时的articleInfoArr就是文章信息数组了
````

- getArticleIdByPage （获取指定页数或者页数数组的文章的文章id）
````javascript
var acArticleSpider = require('acfun-article-spider');
acArticleSpider.initArticleType('情感');
var firstPageDataIds = acArticleSpider.getArticleIdByPage(1);
// 获取第一页的文章ID
var secondPageIds= acArticleSpider.getArticleIdByPage([1, 2]);
// 获取前两页的文章ID
````

#### HOW TO START
- npm install acfun-article-spider