import { jwtGuard } from "../common/jwt.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await jwtGuard(); // 인증 확인
    await initUserProfile(); // 유저 정보 불러오기
    initImageUpload(); // 이미지 업로드 이벤트 초기화
    initNicknameValidation(); // 닉네임 검증
    initUpdateButton(); // 회원정보 수정
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
});

/* -----------------------------------------------------------
 * ✅ 1. 유저 정보 초기화
 * -----------------------------------------------------------*/
async function initUserProfile() {
  try {
    const res = await fetch("http://localhost:8080/api/users", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("유저 정보 요청 실패");

    const data = await res.json();
    document.querySelector(".profile-image img").src =
      data.profileImage || "/haaland.jpeg";
    document.getElementById("email").textContent = data.email;
  } catch (err) {
    console.error("유저 정보 불러오기 실패:", err);
  }
}

/* -----------------------------------------------------------
 * ✅ 2. 이미지 클릭 → 파일 선택 → 서버 업로드
 * -----------------------------------------------------------*/
function initImageUpload() {
  const image = document.querySelector(".profile-image img");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // 클릭 시 파일 선택창 열기
  image.addEventListener("click", () => fileInput.click());

  // 파일 선택 후 업로드
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기 즉시 표시
    const previewUrl = URL.createObjectURL(file);
    image.src = previewUrl;

    const formData = new FormData();
    formData.append("file", file);

    // ✅ 네가 지정한 로직 그대로 사용
    try {
      const response = await fetch("http://localhost:8080/api/users/profile/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("이미지 업로드 실패");

      const fileName = await response.text();
      const uploadedImageUrl = `http://localhost:8080/uploads/${fileName}`;

      // ✅ 쿠키에 저장 (회원가입 시 활용)
      document.cookie = `profileImageUrl=${uploadedImageUrl}; path=/`;

    } catch (error) {
      console.error(error);
      alert("이미지 업로드 중 오류 발생");
    }
  });
}

/* -----------------------------------------------------------
 * ✅ 3. 닉네임 검증
 * -----------------------------------------------------------*/
function initNicknameValidation() {
  const nicknameInput = document.getElementById("nickname");
  nicknameInput.addEventListener("input", (e) => validateNickname(e.target.value));
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
 * ✅ 4. 회원정보 수정 (닉네임 + 쿠키에 저장된 이미지 URL)
 * -----------------------------------------------------------*/
function initUpdateButton() {
  const updateButton = document.getElementById("updateButton");

  updateButton.addEventListener("click", async () => {
    const nickname = document.getElementById("nickname").value.trim();
    if (!validateNickname(nickname)) return;

    // ✅ 쿠키에 저장된 프로필 이미지 URL 가져오기
    const profileImageUrl = getCookie("profileImageUrl") || "www.s3.url";

    const requestBody = { nickname, profileImage: profileImageUrl };

    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (response.ok) {
        alert("회원정보 수정 완료!");
        document.cookie = "profileImageUrl=; Max-Age=0; path=/"; // 쿠키 삭제
        location.href = "/getUser";
      } else {
        alert("회원정보 수정 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원정보 수정 오류:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  });
}

/* -----------------------------------------------------------
 * ✅ 5. 쿠키 유틸리티
 * -----------------------------------------------------------*/
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
