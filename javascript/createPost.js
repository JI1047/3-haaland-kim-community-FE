import { jwtGuard } from "../common/jwt.js";
import { showToast } from "../common/toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    initTitleValidation();
    initImageUpload();
    initCreateButton();
  } catch (e) {
    console.warn("인증 실패:", e.message);
    showToast("🔐 로그인 세션이 만료되었어요. 다시 로그인해주세요!", "error");
  }
});

/* -----------------------------------------------------------
 * 1. 제목 검증
 * -----------------------------------------------------------*/
function initTitleValidation() {
  document.getElementById("title").addEventListener("input", (e) => {
    validateTitle(e.target.value);
  });
}

function validateTitle(title) {
  const errorElement = document.getElementById("titleError");
  if (title.length > 26) {
    errorElement.textContent = "❗ 제목은 26자 이하로 작성해주세요.";
    return false;
  }
  errorElement.textContent = "";
  return true;
}

/* -----------------------------------------------------------
 * 2. 이미지 업로드
 * -----------------------------------------------------------*/
function initImageUpload() {
  const uploadButton = document.querySelector(".submit");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  uploadButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const LAMBDA_UPLOAD_URL =
      "https://dkqpvtnd78.execute-api.ap-northeast-2.amazonaws.com/upload/profile-image";

    const formData = new FormData();
    formData.append("file", file);

    const lambdaRes = await fetch(LAMBDA_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!lambdaRes.ok) throw new Error("Lambda 업로드 실패");

    const json = await lambdaRes.json();
    const uploadedImageUrl = json.data.filePath;

    // 🔥 쿠키 저장
    document.cookie = `postImageUrl=${uploadedImageUrl}; path=/; max-age=${60 * 30};`;

    // 🔥 UI에 파일명 & 미리보기 표시
    document.getElementById("imagePreviewBox").style.display = "block";
    document.getElementById("previewImage").src = uploadedImageUrl;
    document.getElementById("previewFileName").textContent = `📁 ${file.name}`;

    showToast("📸 이미지 등록 완료!", "success");

  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    showToast("🚨 이미지 업로드 중 문제가 발생했어요.", "error");
  }
});

}

/* -----------------------------------------------------------
 * 3. 게시물 생성 요청
 * -----------------------------------------------------------*/
function initCreateButton() {
  document.getElementById("createPostButton").addEventListener("click", async () => {

    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("text").value.trim();

    if (!title || !text) {
      showToast("⚠️ 제목과 내용을 모두 입력해주세요!", "warning");
      return;
    }

    const postImage = getCookie("postImageUrl") || null;

    const requestBody = { title, text, postImage };

    try {
      const response = await fetch(`${window.BACKEND_URL}/api/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (response.ok) {
        showToast("🎉 게시물이 등록됐어요!", "success");
        document.cookie = "postImageUrl=; Max-Age=0; path=/";

        setTimeout(() => (location.href = "/getPostList"), 900);
      } else {
        showToast("❌ 게시물 등록 실패… 다시 시도해볼까요?", "error");
      }
    } catch (error) {
      console.error("게시물 생성 오류:", error);
      showToast("🚨 서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.", "error");
    }
  });
}

/* -----------------------------------------------------------
 * 4. 쿠키 유틸
 * -----------------------------------------------------------*/
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? match[2] : null;
}
