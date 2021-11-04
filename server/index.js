
var express = require('express')
var app = express() // 객체 생성
var cors = require('cors')
var logger = require('morgan')
var mongoose = require('mongoose')
var routes = require('./src/routes') // routes 폴더의 index.js를 자동으로 읽어옴

var corsOptions = { // CORS 옵션
    origin: '*', // 모든 브라우저에서 사용하기 위해 와일드카드 사용(기존 내용: http://localhost:3000)
    credential: true
}

const CONNECT_URL = 'mongodb+srv://zczb123:wndltkr1997!@cluster0.dqptx.mongodb.net/kor_dic_db?retryWrites=true&w=majority' // mongoDB Atlas
 mongoose.connect(CONNECT_URL, { //MongoDB 서버 연결
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected..."))
.catch(e => console.log('failed to connect MongoDB: ${e}'))

app.use(cors(corsOptions)) // CORS 설정
app.use(express.json()) // request body 파싱 설정
app.use(logger('tiny')) // Logger 설정
app.use('/api', routes)

app.get('/hello',(req,res)=>{
    res.send("hello!")
})

app.use((req, res, next) => { // 요청한 페이지가 없는 경우 처리
    res.status(404).send("Sorry... Can't find page")
})

app.use((err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    // 서버 내부 오류 로직 처리
    res.status(500).send("Something is broken on server !")
})

app.listen(process.env.PORT||5000, () => { // 5000 포트로 서버 오픈
    console.log("server is running on port 5000 -nodemon")
})


