import { jwtGuard } from "../common/jwt.js";

(async () => {
  try {
    await jwtGuard();   
    await initPage();   
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
})();

async function initPage() {
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      alert("로그인이 필요합니다.");
      location.href = "/login";
      return;
    }

    const data = await response.json();
    document.getElementById("email").textContent = data.email;
    document.getElementById("nickname").textContent = data.nickname;
  } catch (error) {
    console.error("에러:", error);
  }
}
