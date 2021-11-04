// import
const express = require('express')
const wordRouter = express.Router()
const Word = require("../../models/Word")

wordRouter.route('/(:wordClass)?/(:word)?').get( async (req, res) => {
    let words = []
    // 비구조화 할당 / 특정 property를 풀어서 가져올수있디.
    const { wordClass, word } = req.params
    
    if (word != "undefined" && word != undefined){
        const queries =word.replace(/,/gi,'|') // 
        const and_queries='(?=.*'+word.replace(/,/gi,')(?=.*')+')'
        console.log(and_queries)
        console.log(word)
        // DB에서 쿼리로 단어를 검색
        // 단어 명으로 찾기
        try {
            if (wordClass === "none") {
                words = await Word.find({
                    $or: [
                        {keyword: {$regex: queries}},
                        {meaning: {$regex: queries}}
                    ]});
            }else if (wordClass === "mean"){
                //뜻으로 찾기
                words= await Word.find({meaning:{$regex:and_queries}})
            } else if (wordClass === "word") {
                //단어로 찾기
                words = await Word.find({keyword: {$regex: queries}});
            } else {
                // 품사로 찾기
                words = await Word.find({word_class: {$regex:queries}});
            }
        } catch(e) {
            console.log(e)
        }
        
    }else {
        console.log(word)
        words = await Word.find()
        // DB에서 전체 단어 검색
        try {
            words = await Word.find()
        } catch(e) {
            console.log(e)
        }
    }
    res.json({status:200, words})
})

module.exports = wordRouter