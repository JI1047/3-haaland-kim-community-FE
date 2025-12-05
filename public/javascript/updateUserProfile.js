import { jwtGuard } from "../common/jwt.js";
import { setupImageUploader } from "/common/imageUploader.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await jwtGuard(); // 인증 확인
    await initUserProfile(); // 유저 정보 로드
    initNicknameValidation(); // 닉네임 검증
    initImageUpload(); // 이미지 업로드
    initUpdateButton(); // 수정 버튼
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
});

/* -----------------------------------------------------------
 *  1. 유저 정보 초기화
 * -----------------------------------------------------------*/
async function initUserProfile() {
  try {
    const res = await fetch(`${window.BACKEND_URL}/api/users`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("유저 정보 요청 실패");
    const data = await res.json();

    // email 표시
    document.getElementById("email").textContent = data.email;

    // 프로필 이미지 적용
    const img = document.querySelector(".profile-image img");
    img.src = data.profileImage || "/haaland.jpeg";

  } catch (err) {
    console.error("유저 정보 불러오기 실패:", err);
  }
}

/* -----------------------------------------------------------
 * 2. 공통 이미지 업로드 기능으로 적용
 * -----------------------------------------------------------*/
function initImageUpload() {
  setupImageUploader({
    previewSelector: ".profile-image img",
    inputSelector: "#fileInputHidden",  // 숨겨진 input
    cookieKey: "profileImageUrl",
    onUploaded: (url) => {
      // 미리보기는 공통 모듈이 알아서 처리함
      console.log("프로필 업로드 완료:", url);
    }
  });

  // 이미지 클릭 시 input 열기
  const profileImg = document.querySelector(".profile-image img");
  profileImg.addEventListener("click", () => {
    document.querySelector("#fileInputHidden").click();
  });
}

/* HTML에 숨겨진 input 추가 (단 1회) */
(function appendHiddenInput() {
  if (!document.getElementById("fileInputHidden")) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.id = "fileInputHidden";
    input.style.display = "none";
    document.body.appendChild(input);
  }
})();

/* -----------------------------------------------------------
 *  3. 닉네임 검증
 * -----------------------------------------------------------*/
function initNicknameValidation() {
  document.getElementById("nickname").addEventListener("input", (e) => {
    validateNickname(e.target.value);
  });
}

function validateNickname(nickname) {
  const errorEl = document.getElementById("nicknameError");

  if (!nickname) {
    errorEl.textContent = "닉네임을 입력해주세요.";
    return false;
  }
  if (nickname.length > 10) {
    errorEl.textContent = "닉네임은 최대 10자까지 작성 가능합니다.";
    return false;
  }
  if (nickname.includes(" ")) {
    errorEl.textContent = "띄어쓰기를 없애주세요.";
    return false;
  }

  errorEl.textContent = "";
  return true;
}

/* -----------------------------------------------------------
 *  4. 회원정보 수정 요청
 * -----------------------------------------------------------*/
function initUpdateButton() {
  document.getElementById("updateButton").addEventListener("click", async () => {
    const nickname = document.getElementById("nickname").value.trim();

    if (!validateNickname(nickname)) return;

    const profileImageUrl = getCookie("profileImageUrl") || null;

    const requestBody = {
      nickname,
      profileImage: profileImageUrl,
    };

    try {
      const response = await fetch(`${window.BACKEND_URL}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        alert("회원정보 수정 실패. 다시 시도해주세요.");
        return;
      }

      alert("회원정보 수정 완료!");

      // 쿠키 삭제
      document.cookie = "profileImageUrl=; Max-Age=0; path=/";

      location.href = "/getUser";

    } catch (error) {
      console.error("회원정보 수정 오류:", error);
      alert("서버 요청 중 오류 발생");
    }
  });
}

/* -----------------------------------------------------------
 *  5. 쿠키 유틸리티
 * -----------------------------------------------------------*/
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
