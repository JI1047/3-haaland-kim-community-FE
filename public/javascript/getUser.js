import { jwtGuard } from "../common/jwt.js";
import { showToast } from "../common/toast.js";

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
    const response = await fetch(`${window.BACKEND_URL}/api/users`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      showToast("로그인이 필요합니다.", "warning");
      location.href = "/login";
      return;
    } 

    const S3_BASE_URL = "https://haaland-bucket.s3.ap-northeast-2.amazonaws.com/";
    const data = await response.json();
    document.getElementById("email").textContent = data.email;
    document.getElementById("nickname").textContent = data.nickname;

    const imgElement = document.querySelector(".profile-image img");

    if (!data.profileImage) {
      imgElement.src = "/user.png";
    } else if (data.profileImage.startsWith("http")) {
      imgElement.src = data.profileImage;
    } else {
      imgElement.src = `${S3_BASE_URL}${data.profileImage}`;
    }

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

    const confirmed = await Swal.fire({
      title: "회원 탈퇴를 진행할까요?",
      text: "모든 정보가 삭제되며, 이 작업은 되돌릴 수 없습니다.",
      icon: "warning",
      confirmButtonText: "네, 탈퇴할게요",
      cancelButtonText: "취소",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
    }).then((res) => res.isConfirmed);

    if (!confirmed) return;

    try {
      const response = await fetch(`${window.BACKEND_URL}/api/users`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        await Swal.fire({
          title: "탈퇴 완료",
          text: "그동안 이용해주셔서 감사합니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#4f7bff",
        });
        location.href = "/login";
      } else {
        showToast("회원탈퇴 실패. 다시 시도해주세요.", "error");
      }

    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      showToast("서버 요청 중 오류가 발생했습니다.", "error");
    }
  });
}
