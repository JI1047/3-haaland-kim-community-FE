/**
 * 공통 헤더 로더
 * 모든 페이지에서 <div id="header"> 안에 header.html 삽입
 * 세션 쿠키(sessionID)를 기준으로 로그인 여부에 따라 버튼 표시 변경
 */

import { checkJwt, logout } from "/common/jwt.js";//session.js import

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/common/header.html");
    const headerHtml = await res.text();
    document.getElementById("header").innerHTML = headerHtml;

    if (!document.querySelector('link[href$="header.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = window.location.origin + "/css/header.css"; 
      document.head.appendChild(link);
    }


    const session = await checkJwt();//session.js의 checkSession함수를 통해 session 여부확인

    /**
     * session이 존재할 경우 로그인,회원가입 버튼 hidden처리
     * session이 존재하지 않을 경우 마이페이지 로그아웃 버튼 hidden처리
     */
    document.getElementById("login").hidden = session.login;
    document.getElementById("signup").hidden = session.login;

    document.getElementById("user-info").hidden = !session.login;
    document.getElementById("logout").hidden = !session.login;

    /**
     * logout 버튼 클릭시 session js를 통한 처리
     */
    document.getElementById("logout").addEventListener("click",logout);

  } catch (error) {
    console.error("헤더 로드 중 오류:", error);
  }
});
