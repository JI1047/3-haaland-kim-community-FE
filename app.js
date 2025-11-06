// app.js

const express = require('express');
const path = require('path');

//  node-fetch (EC2 메타데이터 조회용)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

/**
 *  EC2 퍼블릭 IP 자동 가져오기
 * - EC2 내부에서 실행되면 실제 퍼블릭 IP 사용
 * - 로컬 환경에서는 localhost로 fallback
 */
async function getPublicIp() {
  try {
    const res = await fetch("http://169.254.169.254/latest/meta-data/public-ipv4");
    if (!res.ok) throw new Error("Failed to fetch EC2 metadata");
    const ip = await res.text();
    console.log(" EC2 Public IP:", ip);
    return ip;
  } catch (err) {
    console.error(" EC2 IP fetch 실패:", err.message);
    return "localhost"; // 로컬 fallback
  }
}

//  Express 서버 시작 전 IP 가져와서 BACKEND_URL 구성
(async () => {
  const publicIp = await getPublicIp();
  const BACKEND_URL = `http://${publicIp}:8080`;

  console.log("✅ BACKEND_URL:", BACKEND_URL);

  // ---------------------------------------------------------
  //  정적 파일 서빙
  // ---------------------------------------------------------
  app.use(express.static(path.join(__dirname, "public")));

  // ---------------------------------------------------------
  // env.js: 프론트엔드에서 window.BACKEND_URL 로 접근 가능
  // ---------------------------------------------------------
  app.get("/env.js", (req, res) => {
    res.type("application/javascript");
    res.send(`window.BACKEND_URL = "${BACKEND_URL}";`);
  });

  // ---------------------------------------------------------
  // HTML 라우팅
  // ---------------------------------------------------------
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/getPostList.html"));
  });

  app.get("/createPost", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/createPost.html"));
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/login.html"));
  });

  //  회원가입 → 백엔드 thymeleaf 페이지로 리다이렉트
  app.get("/signup", (req, res) => {
    res.redirect(`${BACKEND_URL}/terms`);
  });

  //  다음 단계 → signup.html 로 이동
  app.get("/signup-input", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/signup.html"));
  });

  app.get("/getUser", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/getUser.html"));
  });

  app.get("/updateUserProfile", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/updateUserProfile.html"));
  });

  app.get("/updateUserPassword", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/updateUserPassword.html"));
  });

  app.get("/getPostList", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/getPostList.html"));
  });

  app.get("/getPost", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/getPost.html"));
  });

  app.get("/updatePost", (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/updatePost.html"));
  });

  // ---------------------------------------------------------
  //  서버 실행
  // ---------------------------------------------------------
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on port ${PORT}`);
  });
})();
