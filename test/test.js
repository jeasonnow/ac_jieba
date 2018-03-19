const asc = require('../deploy/index');
const assert = require('assert');

describe('api test', () =>{
    it('should return array result from api: getArticleInfoByPage', () =>{
        asc.getArticleInfoByPage(1).then(res => {
            assert.equal(true, Array.isArray(res));
        });
    })

    it('should get array result from api: getKeywords', () =>{
        asc.getKeywords().then(res => {
            assert.equal(true ,Array.isArray(res));
        });
    })

    it('should return array result from api: getArticleIdByPage', () =>{    
        asc.getArticleIdByPage(1).then((res) => {
            assert.equal(true, Array.isArray(res));
        });
    });

    it('this array item must be number, api: getArticleIdByPage', () =>{
        asc.getArticleIdByPage(1).then((res) => {
            res.forEach((item) => {
                assert.equal('number', typeof item);
            });
        });
    })
});
