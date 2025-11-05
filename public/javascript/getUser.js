import { jwtGuard } from "../common/jwt.js";

(async () => {
  try {
    await jwtGuard();   
    await initPage();   
    initDeleteUserButton();
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
    document.querySelector(".profile-image img").src = data.profileImage || "/haaland.jpeg";

  } catch (error) {
    console.error("에러:", error);
  }
}
/* ----------------------------------------------------------
 *  회원 탈퇴 이벤트
 * ---------------------------------------------------------- */
function initDeleteUserButton() {
  const deleteButton = document.getElementById("deleteUserButton");

  deleteButton.addEventListener("click", async () => {
    if (!confirm("정말로 회원 탈퇴하시겠습니까?")) return;

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        alert("회원탈퇴가 완료되었습니다.");
        location.href = "/login"; // 로그인 페이지로 이동
      } else {
        alert("회원탈퇴 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  });
}
