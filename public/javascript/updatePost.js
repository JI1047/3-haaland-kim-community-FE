//  게시물 수정 페이지 JS
let postId;

/* -----------------------------------------------------------
 * 1 페이지 로드 시 게시물 데이터 불러오기
 * -----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();     // 기존 게시물 정보 불러오기
  initImageUpload();          // 이미지 업로드 초기화
  initTitleValidation();      // 제목 검증 이벤트 등록
  initUpdateButton();         // 수정 버튼 이벤트 등록
});

/* -----------------------------------------------------------
 *  게시물 정보 불러오기
 * -----------------------------------------------------------*/
async function loadPostDetail() {
  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      alert("로그인이 필요합니다.");
      return;
    }

    const data = await response.json();
    document.getElementById("title").value = data.title;
    document.getElementById("text").value = data.text;
  } catch (error) {
    console.error("게시물 불러오기 실패:", error);
  }
}

/* -----------------------------------------------------------
 *  이미지 업로드 로직
 * -----------------------------------------------------------*/
function initImageUpload() {
  const imageButton = document.querySelector(".submit");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // 버튼 클릭 시 파일 선택창 열기
  imageButton.addEventListener("click", () => fileInput.click());

  // 파일 선택 후 업로드 수행
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

      // ✅ 쿠키에 저장 → 수정 시 PUT 요청에 포함
      document.cookie = `postImageUrl=${uploadedImageUrl}; path=/`;
      alert("이미지 업로드 완료!");
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 중 오류 발생");
    }
  });
}

/* -----------------------------------------------------------
 *  제목 검증 로직
 * -----------------------------------------------------------*/
function initTitleValidation() {
  document.getElementById("title").addEventListener("input", (e) => {
    const title = e.target.value;
    validateTitle(title);
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
 *  게시물 수정 요청 (PUT)
 * -----------------------------------------------------------*/
function initUpdateButton() {
  document.getElementById("updateButton").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("text").value.trim();

    if (!validateTitle(title)) return;

    // ✅ 쿠키에서 업로드된 이미지 URL 가져오기
    const postImageUrl = getCookie("postImageUrl") || "www.s3.url";

    const requestBody = { title, text, postImage: postImageUrl };

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (response.ok) {
        alert("게시글 수정 성공!");
        document.cookie = "postImageUrl=; Max-Age=0; path=/"; // ✅ 쿠키 삭제
        location.href = `/getPost?id=${postId}`;
      } else {
        alert("게시글 수정 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("서버 요청 중 오류:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  });
}

/* -----------------------------------------------------------
 *  쿠키 유틸
 * -----------------------------------------------------------*/
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
