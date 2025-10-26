/**
 * 세션 상태 공통 관리 (session.js)
 * 모든 페이지에서 import해서 사용 가능
 * 로그인 여부 판단 및. 로그아웃 처리 API 연결
 */

/** 세션 존재 여부 확인 
 * - Spring Server의 /api/session/check 엔드포인트 호출
 * - 세션 쿠키를 자동으로 포함 (credentials: "include")
 *
*/
export async function checkSession() {
  try {
    const res = await fetch("http://localhost:8080/api/session/check", {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("세션 없음");
      return { login: false };
    }
  } catch (error) {
    console.error("세션 확인 중 오류:", error);
    return { login: false };
  }
}

/** 로그아웃 처리 */
export async function logout() {
  try {
    await fetch("http://localhost:8080/api/users/log-out", { 
      method: "PUT",
      credentials: "include"//쿠키를 포함하여 요청을 전송
    });
    alert("로그아웃 되었습니다.");
    window.location.href = "/login";//로그아웃 이후 로그인 페이지로 리다이렉트
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
}
