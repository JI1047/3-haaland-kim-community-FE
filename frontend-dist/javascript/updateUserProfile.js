import { jwtGuard } from "../common/jwt.js";
import { showToast } from "../common/toast.js";   // 🔥 추가

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await jwtGuard();
    await initUserProfile();
    initNicknameValidation();
    initImageUpload();
    initUpdateButton();
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
});

/* -----------------------------------------------------------
 * 1. 유저 정보 불러오기
 * -----------------------------------------------------------*/
async function initUserProfile() {
  try {
    const res = await fetch(`${window.BACKEND_URL}/api/users`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("유저 정보 요청 실패");

    const data = await res.json();

    document.getElementById("email").textContent = data.email;
    document.getElementById("nickname").value = data.nickname;

    const img = document.querySelector(".profile-image img");
    img.src = data.profileImage || "/haaland.jpeg";

  } catch (err) {
    console.error("유저 정보 불러오기 실패:", err);
    showToast("🚨 유저 정보를 가져오지 못했습니다.", "error");   // 🔥 추가
  }
}

/* -----------------------------------------------------------
 * 2. 이미지 업로드
 * -----------------------------------------------------------*/
function initImageUpload() {
  const previewImg = document.querySelector(".profile-image img");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  previewImg.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    previewImg.src = URL.createObjectURL(file);

    try {
      const LAMBDA_UPLOAD_URL =
        "https://dkqpvtnd78.execute-api.ap-northeast-2.amazonaws.com/upload/profile-image";

      const formData = new FormData();
      formData.append("file", file);

      const lambdaRes = await fetch(LAMBDA_UPLOAD_URL, {
        method: "POST",
        body: formData
      });

      if (!lambdaRes.ok) throw new Error("Lambda 업로드 실패");

      const lambdaJson = await lambdaRes.json();
      const uploadedUrl = lambdaJson.data.filePath;

      document.cookie = `profileImageUrl=${uploadedUrl}; path=/; max-age=${60 * 30};`;

      showToast("📸 이미지 업로드 완료!", "success");   // 🔥 변경

    } catch (err) {
      console.error("프로필 업로드 오류:", err);
      showToast("🚨 이미지 업로드 실패", "error");     // 🔥 변경
    }
  });
}

/* -----------------------------------------------------------
 * 3. 닉네임 검증
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
 * 4. 유저 프로필 수정 요청
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
        showToast("❌ 회원정보 수정 실패. 다시 시도해주세요.", "error");  // 🔥 변경
        return;
      }

      showToast("✨ 회원정보 수정 완료!", "success");   // 🔥 변경

      document.cookie = "profileImageUrl=; Max-Age=0; path=/";

      setTimeout(() => (location.href = "/getUser"), 700);

    } catch (error) {
      console.error("회원정보 수정 오류:", error);
      showToast("🚨 서버 오류가 발생했습니다.", "error");  // 🔥 변경
    }
  });
}

/* -----------------------------------------------------------
 * 5. 쿠키 유틸
 * -----------------------------------------------------------*/
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
