import { jwtGuard } from "../common/jwt.js";
import { showToast } from "../common/toast.js";

(async () => {
  try {
    await jwtGuard();   
    await initPage();   
    initDeleteUserButton();
  } catch (e) {
    console.warn("인증 실패:", e.message);
    showToast("🔐 로그인 세션이 만료되었습니다.", "error");
  }
})();

async function initPage() {
  try {
    const response = await fetch(`${window.BACKEND_URL}/api/users`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      showToast("⚠️ 로그인이 필요합니다.", "warning");
      location.href = "/login";
      return;
    }

    const S3_BASE_URL = "https://haaland-bucket.s3.ap-northeast-2.amazonaws.com/";
    const data = await response.json();

    document.getElementById("email").textContent = data.email;
    document.getElementById("nickname").textContent = data.nickname;

    const imgElement = document.querySelector(".profile-image img");
    imgElement.src = data.profileImage?.startsWith("http")
      ? data.profileImage
      : data.profileImage
      ? `${S3_BASE_URL}${data.profileImage}`
      : "/user.png";

  } catch (error) {
    console.error("에러:", error);
    showToast("🚨 사용자 정보를 불러오지 못했습니다.", "error");
  }
}

/* ------------------------------
 *  회원 탈퇴
 * ------------------------------*/
function initDeleteUserButton() {
  const deleteButton = document.getElementById("deleteUserButton");

  deleteButton.addEventListener("click", async () => {
    if (!confirm("정말로 회원 탈퇴하시겠습니까?")) return;

    try {
      const response = await fetch(`${window.BACKEND_URL}/api/users`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        showToast("👋 회원 탈퇴가 완료되었습니다.", "success");
        setTimeout(() => location.href = "/login", 800);
      } else {
        showToast("❌ 회원탈퇴 실패. 다시 시도해주세요.", "error");
      }
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      showToast("🚨 서버 오류가 발생했습니다.", "error");
    }
  });
}
