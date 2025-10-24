/**
 *  회원정보 조회 시 fetch 연결 요청
 * 1. 회원정보 조회 페이지에 접근했을 때 실행되는 fetch 요청
 * 2. 현재 쿠키에 저장된 세션을 통해서 http://127.0.0.1:8080/api/users로 백엔드 GET요청을 보냄
 * 3. 세션 쿠키를 포함하기 위헤 credentials: "include"로 설정
 * 4. 서버로부터 받은 회원 정보를 HTML 요소(id=email, id=nickname)에 표시
 * 5. 응답 오류 발생 시 경고창 또는 콘솔을 통해 오류 메시지를 표시
 */
document.addEventListener("DOMContentLoaded", async () => {
    console.log(document.cookie);

    const isLogin = document.cookie.includes("sessionID=");

    // document.getElementById("user-info").hidden = !isLogin;
    // document.getElementById("update-profile").hidden = !isLogin;
    // document.getElementById("logout").hidden = !isLogin;
    document.getElementById("login").hidden = isLogin;
    document.getElementById("signup").hidden = isLogin;
    
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      alert("로그인이 필요합니다.");
      // location.href = "/login";
      return;
    }

    const data = await response.json();
    document.getElementById("email").textContent = data.email;
    document.getElementById("nickname").textContent = data.nickname;
  } catch (error) {
    console.error("에러:", error);
  }
});

function checkSessionCookie() {
  if(document.cookie.includes('sessionID')){
    return true;
  }
  else{
    return false;
  }
}
