/**
 * ✅ 세션 상태 공통 관리 (session.js)
 * 모든 페이지에서 import해서 사용 가능
 */

/** 세션 존재 여부 확인 */
export async function checkSession() {
  try {
    const res = await fetch("http://localhost:8080/api/session/check", {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      console.log("세션 유지 중 ✅", data);
      return data; // { login: true, user: {...} }
    } else {
      console.log("세션 없음 ❌");
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
      credentials: "include"
    });
    alert("로그아웃 되었습니다.");
    window.location.href = "/login";
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
}
