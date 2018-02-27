import jieba from 'nodejieba';

const TOP_NUMBER = 3;

export default {
    getKeyword: (content) => {
        // 此处使用默认字典
        let keyWordsArray = jieba.extract(content, TOP_NUMBER);
        return keyWordsArray;
    },
    extraDict: (dictPath) => {
        jieba.load({
            userDict: dictPath,
        });
    }
}