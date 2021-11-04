// import
const express = require('express')
const WordRouter = express.Router()
const Word = require("../../models/Word")

// logic
WordRouter.route('/(:word)?').get(async (req, res) => { // 정규표현식 옵션: '/api/word/', '/api/words/단어'를 따로 처리
    let words = []
    const { word } = req.params // { }: (javascript) 비구조화 할당
    console.log(word) // 웹 브라우저 콘솔 X -> VSCode 터미널
    
    if(word !== "undefined" && word !== undefined){ // undefined: 값이 없을 때(*브라우저에서 넘어오는 값이 String이기 때문에 " " 안에 작성해야 할 수도 있음)
        // 데이터베이스에서 쿼리로 단어 검색
        try{
            //words = await Word.find({keyword: word});
            words = await Word.find({keyword: {$regex: `^${word}`}}) // 검색어로 시작하는 단어 검색
            words = await Word.find({keyword: {$regex: `${word}$`}}) // 검색어로 끝나는 단어 검색
            words = await Word.find({meaning: {$regex: `${word}`}}) // 의미 필드에서 검색어가 들어가는 단어 검색
            words = await Word.find({ // 단어와 의미 내에 검색어가 포함 되어 있는 단어 검색
                $or: [
                    {keyword: {$regex: `${word}`}},
                    {meaning: {$regex: `${word}`}}
                ]
            }).sort({"_id":-1}) // -1: 최신순(내림차순), 1: 과거순(오름차순)
            .limit(6) // 검색 결과 6개만 출력
        }catch(e){
            consolg.log(e)
        }

    } else {
        // 키워드가 없을 때에는 전체 단어 검색
        // res.send('전체 조회') 
        words = await Word.find()
        try{
            words = await Word.find()
        }catch(e){
            console.log(e)
        }
    }

    res.json({status: 200, words})
}) 

// export
module.exports = WordRouter