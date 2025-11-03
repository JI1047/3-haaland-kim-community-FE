/**
 * JWT 검증 및 자동 재발급 (AccessToken 만료 시 RefreshToken으로 복구)
 */
export async function checkJwt() {
  try {
    const res = await fetch("http://localhost:8080/api/jwt/validate", {
      method: "GET",
      credentials: "include",
    });

    console.log("응답 상태 코드:", res.status);

    if (res.ok) {
      const data = await res.json();
      return data;
    }

    // 401 → 로그인 필요
    if (res.status === 401) {
      console.warn("AccessToken 만료 또는 로그인 필요");
      return { login: false };
    }

    // 기타 오류
    return { login: false };

  } catch (error) {
    console.error("jwt 확인 중 오류:", error);
    return { login: false };
  }
}


/**
 * 보호된 페이지 진입 시 JWT 검증
 * - checkJwt()로 로그인 상태 확인
 * - 실패 시 로그인 페이지로 리다이렉트
 */
export async function jwtGuard(redirectUrl = "/login") {
  const result = await checkJwt();

  if (!result.login) {
    alert("로그인이 필요합니다.");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100); // UX 개선: 0.8초 정도 자연스럽게
    throw new Error("인증 실패");
  }

  return result.userId;
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
