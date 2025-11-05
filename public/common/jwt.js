/**
 * JWT 검증 및 자동 재발급 (AccessToken 만료 시 RefreshToken으로 복구)
 */
export async function checkJwt() {
  try {
    const res = await fetch("http://localhost:8080/api/jwt/validate", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data; 
    }

    if (res.status === 401) return { login: false };
    return { login: false };

  } catch (error) {
    console.error("JWT 확인 중 오류:", error);
    return { login: false };
  }
}


/**
 * 보호된 페이지 접근 시 JWT 검증
 */
export async function jwtGuard(redirectUrl = "/login") {
  const result = await checkJwt();

  if (!result.login) {
    alert("로그인이 필요합니다.");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
    throw new Error("인증 실패");
  }

  return result.userId;
}


/**
 * 로그아웃 처리
 */
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
