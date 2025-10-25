/**
 * ✅ 공통 헤더 로더
 * 모든 페이지에서 <div id="header"> 안에 header.html 삽입
 * 세션 쿠키(sessionID)를 기준으로 로그인 여부에 따라 버튼 표시 변경
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1️⃣ header.html 파일을 가져와서 삽입
    const res = await fetch("/common/header.html");
    const headerHtml = await res.text();
    document.getElementById("header").innerHTML = headerHtml;

    // 2️⃣ header.css 자동 로드 (중복 방지)
    if (!document.querySelector('link[href$="header.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = window.location.origin + "/css/header.css"; // ✅ 경로 수정 (common → css)
      document.head.appendChild(link);
    }

    // 3️⃣ 로그인 상태 확인 (세션 쿠키 존재 여부)
    const isLogin = document.cookie.includes("sessionID=");

    // 4️⃣ 버튼 표시 토글
    document.getElementById("login").hidden = isLogin;
    document.getElementById("signup").hidden = isLogin;

    document.getElementById("user-info").hidden = !isLogin;
    document.getElementById("logout").hidden = !isLogin;

    // 5️⃣ 로그아웃 클릭 시 쿠키 제거 요청
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await fetch("http://localhost:8080/api/users/logout", {
          method: "POST",
          credentials: "include",
        });
        alert("로그아웃 되었습니다.");
        window.location.href = "/login";
      });
    }

  } catch (error) {
    console.error("헤더 로드 중 오류:", error);
  }
});
