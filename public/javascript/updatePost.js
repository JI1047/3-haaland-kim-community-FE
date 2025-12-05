import { setupImageUploader } from "/common/imageUploader.js";

let postId;

/* -----------------------------------------------------------
 * 1. 페이지 로드 시 데이터 불러오기
 * -----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();     // 기존 게시물 정보
  initTitleValidation();      // 제목 검증
  initImageUpload();          // 이미지 업로드 통합 적용
  initUpdateButton();         // 수정 요청
});

/* -----------------------------------------------------------
 *  게시물 정보 불러오기
 * -----------------------------------------------------------*/
async function loadPostDetail() {
  try {
    const res = await fetch(`${window.BACKEND_URL}/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      alert("로그인이 필요합니다.");
      return;
    }

    const data = await res.json();

    document.getElementById("title").value = data.title;
    document.getElementById("text").value = data.text;

    // 이미지 미리보기 적용 (있으면)
    const preview = document.getElementById("previewImage");
    if (data.postImage) {
      preview.src = data.postImage;
    }

  } catch (err) {
    console.error("게시물 불러오기 실패:", err);
  }
}

/* -----------------------------------------------------------
 * 2. 이미지 업로드 로직 — 공통 모듈 적용
 * -----------------------------------------------------------*/
function initImageUpload() {
  setupImageUploader({
    previewSelector: "#previewImage",
    inputSelector: "#fileInputHidden",
    cookieKey: "postImageUrl",

    onUploaded: (url) => {
      console.log("게시물 이미지 업로드 완료:", url);
    }
  });

  // 이미지 클릭 시 파일 선택창 열기
  document.getElementById("previewImage").addEventListener("click", () => {
    document.getElementById("fileInputHidden").click();
  });
}

/* 숨겨진 input이 없다면 자동 생성 */
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

    // 업로드된 이미지 URL (없으면 기존 URL 그대로 보내도록 null 처리)
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
        alert("게시글 수정 성공!");
        document.cookie = "postImageUrl=; Max-Age=0; path=/"; // 쿠키 삭제
        location.href = `/getPost?id=${postId}`;
      } else {
        alert("게시글 수정 실패. 다시 시도해주세요.");
      }

    } catch (error) {
      console.error("수정 요청 오류:", error);
      alert("서버 요청 중 오류 발생");
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
