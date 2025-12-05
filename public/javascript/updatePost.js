let postId;

/* -----------------------------------------------------------
 * 1. 페이지 로드 시 데이터 불러오기
 * -----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();
  initTitleValidation();
  initImageUpload();   // ← 회원가입 방식으로 변경됨
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
      alert("로그인이 필요합니다.");
      return;
    }

    const data = await res.json();

    document.getElementById("title").value = data.title;
    document.getElementById("text").value = data.text;

    const preview = document.getElementById("previewImage");
    preview.src = data.postImage || "/default.png";

  } catch (err) {
    console.error("게시물 불러오기 실패:", err);
  }
}

/* -----------------------------------------------------------
 * 2. 이미지 업로드 (회원가입과 동일한 방식)
 * -----------------------------------------------------------*/
function initImageUpload() {
  const previewImage = document.getElementById("previewImage");

  // 숨겨진 파일 input 생성
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // 이미지 클릭하면 input 열기
  previewImage.addEventListener("click", () => fileInput.click());

  // 파일 선택 시 Lambda 업로드
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    previewImage.src = URL.createObjectURL(file); // 미리보기 적용

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

      const lambdaJson = await lambdaRes.json();
      const uploadedUrl = lambdaJson.data.filePath;

      // 쿠키 저장
      document.cookie = `postImageUrl=${uploadedUrl}; path=/; max-age=${60 * 30}`;

      alert("이미지 업로드 완료!");

    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드 실패");
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
        alert("게시글 수정 성공!");
        document.cookie = "postImageUrl=; Max-Age=0; path=/";
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
