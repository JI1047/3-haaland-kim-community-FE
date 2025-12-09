import { checkJwt, logout } from "/common/jwt.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // ✅ header.html 삽입
    const res = await fetch("/common/header.html");
    const headerHtml = await res.text();
    document.getElementById("header").innerHTML = headerHtml;

    // ✅ CSS 중복 방지
    if (!document.querySelector('link[href$="header.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = window.location.origin + "/css/header.css";
      document.head.appendChild(link);
    }

    // ✅ JWT 검증
    const session = await checkJwt();

    // ✅ 버튼 표시 제어
    const userLink = document.querySelector(".user-link");
    document.getElementById("login").hidden = session.login;
    document.getElementById("signup").hidden = session.login;
    document.getElementById("logout").hidden = !session.login;
    userLink.style.display = "flex"; // 최종 상태만 노출

    // ✅ 프로필 이미지 교체
    const headerImg = document.querySelector(".header img");
    if (session.login) {
      headerImg.src = session.profileImage || "/user.png";

      // 프로필 클릭 시 마이페이지로 이동
      headerImg.style.cursor = "pointer";
      headerImg.addEventListener("click", () => {
        window.location.href = "/getUser";
      });
    }

    // ✅ 로그아웃 처리
    document.getElementById("logout").addEventListener("click", logout);

  } catch (error) {
    console.error("헤더 로드 중 오류:", error);
  }
});
