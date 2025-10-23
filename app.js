// node_modules 에 있는 express 관련 파일을 가져온다.
var express = require('express')
const path = require('path')

// express 는 함수이므로, 반환값을 변수에 저장한다.
var app = express()

// 3000 포트로 서버 오픈
app.listen(3000, function() {
    console.log("start! express server on port 3000")
})

app.use(express.static(path.join(__dirname, "public")))

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/public/html/getPostList.html")
})

app.get('/createPost',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/createPost.html"))
})
app.get('/login',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/login.html"))
})
app.get('/signup',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/signup.html"))
})
app.get('/getUser',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/getUser.html"))
})
app.get('/updateUserProfile',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/updateUserProfile.html"))
})
app.get('/updateUserPassword',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/updateUserPassword.html"))
})
app.get('/getPostList',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/getPostList.html"))
})
app.get('/getPost',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/getPost.html"))
})
app.get('/updatePost',(req,res) =>{
    res.sendFile(path.join(__dirname, "public/html/updatePost.html"))
})