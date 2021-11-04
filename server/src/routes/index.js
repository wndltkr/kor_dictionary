const express = require('express')
const router = express.Router() // express의 메서드
const word = require('./word') // 경로: 동일 depth 'word' 디렉토리

router.use('/words', word) // api/word/하위처리로직

module.exports = router