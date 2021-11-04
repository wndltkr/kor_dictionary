const mongoose = require('mongoose')

const wordSchema = mongoose.Schema({ // 스키마 생성
    seq: {type: String, trim: true}, // 순번
    keyword: {type: String, trim: true}, // 단어
    link: {type: String, trim: true}, // 링크
    hanja: {type: String, trim: true}, // 한자
    word_class: {type: String, trim: true}, // 품사
    meaning: {type: String, trim: true} // 뜻
})

const Word = mongoose.model('Word', wordSchema, 'kor_dic_col') // 스키마로부터 생성된 모델 객체 초기화
module.exports = Word;