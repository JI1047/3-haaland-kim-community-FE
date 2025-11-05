import { jwtGuard } from "../common/jwt.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await jwtGuard(); // 로그인 여부 확인
    initTitleValidation();
    initImageUpload();
    initCreateButton();
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
});

/* -----------------------------------------------------------
 * ✅ 1. 제목 입력 검증
 * -----------------------------------------------------------*/
function initTitleValidation() {
  document.getElementById("title").addEventListener("input", (e) => {
    validateTitle(e.target.value);
  });
}

function validateTitle(title) {
  const errorElement = document.getElementById("titleError");
  if (title.length > 26) {
    errorElement.textContent = "제목은 최대 26자까지 작성 가능합니다.";
    return false;
  }
  errorElement.textContent = "";
  return true;
}

/* -----------------------------------------------------------
 * ✅ 2. 이미지 업로드 로직 (회원 프로필과 동일)
 * -----------------------------------------------------------*/
function initImageUpload() {
  const uploadButton = document.querySelector(".submit");

  // 숨겨진 input 생성
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // 버튼 클릭 → 파일 선택창 열기
  uploadButton.addEventListener("click", () => fileInput.click());

  // 파일 선택 시 자동 업로드
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/posts/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("이미지 업로드 실패");

      const fileName = await response.text();
      const uploadedImageUrl = `http://localhost:8080/uploads/${fileName}`;

      // ✅ 쿠키 저장 (게시물 생성 시 사용)
      document.cookie = `postImageUrl=${uploadedImageUrl}; path=/`;

      alert("이미지 업로드 완료!");
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 중 오류 발생");
    }
  });
}

/* -----------------------------------------------------------
 * ✅ 3. 게시물 생성 요청
 * -----------------------------------------------------------*/
function initCreateButton() {
  document.getElementById("createPostButton").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("text").value.trim();

    if (!title || !text) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // ✅ 쿠키에 저장된 이미지 URL 불러오기
    const postImage = getCookie("postImageUrl") || null;

    const requestBody = { title, text, postImage };

    try {
      const response = await fetch("http://localhost:8080/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (response.ok) {
        alert("게시물 생성 성공!");
        // 쿠키 정리
        document.cookie = "postImageUrl=; Max-Age=0; path=/";
        location.href = "/getPostList";
      } else {
        alert("게시물 생성 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("게시물 생성 오류:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  });
}

/* -----------------------------------------------------------
 * ✅ 4. 쿠키 유틸리티
 * -----------------------------------------------------------*/
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
