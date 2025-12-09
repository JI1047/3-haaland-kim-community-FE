import { showToast } from "../common/toast.js";   // 🔥 추가

let postId;

/* -----------------------------------------------------------
 * 1. 페이지 로드 시 데이터 불러오기
 * -----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();
  initTitleValidation();
  initImageUpload();
  initUpdateButton();
});

/* -----------------------------------------------------------
 * 게시물 정보 불러오기
 * -----------------------------------------------------------*/
async function loadPostDetail() {
  try {
    const res = await fetch(`${window.BACKEND_URL}/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      showToast("⚠️ 로그인이 필요합니다!", "warning");   // 🔥 변경
      return;
    }

    const data = await res.json();

    document.getElementById("title").value = data.title;
    document.getElementById("text").value = data.text;

    // 기존 게시물 이미지 → 쿠키 저장
    if (data.postImage) {
      document.cookie = `postImageUrl=${data.postImage}; path=/; max-age=${60 * 30}`;
    }

  } catch (err) {
    console.error("게시물 불러오기 실패:", err);
    showToast("🚨 게시물 조회 중 오류 발생", "error");  // 🔥 추가
  }
}

/* -----------------------------------------------------------
 * 2. 이미지 업로드 (수정 페이지 버전 — 미리보기 포함)
 * -----------------------------------------------------------*/
function initImageUpload() {
  const uploadBtn = document.querySelector(".submit");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  uploadBtn.addEventListener("click", () => fileInput.click());

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
      const uploadedUrl = json.data.filePath;

      // 🔥 업로드한 이미지 URL 쿠키 저장
      document.cookie = `postImageUrl=${uploadedUrl}; path=/; max-age=${60 * 30}`;

      // 🔥 UI 미리보기 표시 (create 화면과 동일)
      document.getElementById("imagePreviewBox").style.display = "block";
      document.getElementById("previewImage").src = uploadedUrl;
      document.getElementById("previewFileName").textContent = `📁 ${file.name}`;

      showToast("📸 이미지 업로드 완료!", "success");

    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      showToast("🚨 이미지 업로드 실패", "error");
    }
  });
}

/* -----------------------------------------------------------
 * 3. 제목 검증
 * -----------------------------------------------------------*/
function initTitleValidation() {
  document.getElementById("title").addEventListener("input", (e) => {
    validateTitle(e.target.value);
  });
}

function validateTitle(title) {
  const el = document.getElementById("titleError");
  if (title.length > 26) {
    el.textContent = "제목은 최대 26자까지 작성 가능합니다.";
    return false;
  }
  el.textContent = "";
  return true;
}

/* -----------------------------------------------------------
 * 4. 게시물 수정 PUT 요청
 * -----------------------------------------------------------*/
function initUpdateButton() {
  document.getElementById("updateButton").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("text").value.trim();

    if (!validateTitle(title)) return;

    const postImageUrl = getCookie("postImageUrl") || null;

    const requestBody = { title, text, postImage: postImageUrl };

    try {
      const res = await fetch(`${window.BACKEND_URL}/api/posts/${postId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (res.ok) {
        showToast("✏️ 게시글 수정 완료!", "success");     // 🔥 변경
        document.cookie = "postImageUrl=; Max-Age=0; path=/";
        setTimeout(() => (location.href = `/getPost?id=${postId}`), 700);
      } else {
        showToast("❌ 수정 실패, 다시 시도해주세요.", "error");  // 🔥 변경
      }

    } catch (error) {
      console.error("수정 요청 오류:", error);
      showToast("🚨 서버 오류 발생", "error");  // 🔥 변경
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
