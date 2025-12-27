// app.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// 🔥 1. 정적 파일 먼저!!!
app.use(express.static(path.join(__dirname, "public")));

// EC2 환경변수에서 BACKEND_URL 읽기 (run-all.sh에서 세팅됨)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// ---------------------------------------------------------
// env.js: 프론트엔드에서 window.BACKEND_URL 로 접근 가능
// ---------------------------------------------------------
app.get("/env.js", (req, res) => {
  res.type("application/javascript");
  res.send(`window.BACKEND_URL = "${BACKEND_URL}";`);
});

// ---------------------------------------------------------
// 정적 파일 서빙 
// ---------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));
 

// ALB Health Check 용 헬스체크 엔드포인트
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ---------------------------------------------------------
// HTML 라우팅
// ---------------------------------------------------------
app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/getPostList.html"))
);
app.get("/createPost", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/createPost.html"))
);
app.get("/login", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/login.html"))
);

// ✅ 백엔드 thymeleaf 페이지로 리다이렉트
app.get("/signup", (_, res) => {
  res.redirect(`${BACKEND_URL}/api/terms/signup`);
});


// ✅ 다음 단계 signup.html
app.get("/signup-input", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/signup.html"))
);

app.get("/getUser", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/getUser.html"))
);
app.get("/updateUserProfile", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/updateUserProfile.html"))
);
app.get("/updateUserPassword", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/updateUserPassword.html"))
);
app.get("/getPostList", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/getPostList.html"))
);
app.get("/getPost", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/getPost.html"))
);
app.get("/updatePost", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/updatePost.html"))
);



module.exports = app;