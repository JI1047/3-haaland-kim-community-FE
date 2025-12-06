/**
 * 게시물 상세 페이지 
 * 1) 게시물 상세 조회
 * 2) 댓글 섹션 초기화
 * 3) 전역 이벤트 위임 등록
 */
import { initCommentSection } from "./commentRender.js";
import { initGlobalEventDelegation } from "./commentEvent.js";
import { showToast } from "../common/toast.js";  // 🔥 토스트 추가

let postId;

// 초기 실행
document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();     // 게시물 상세 조회
  initCommentSection(postId); // 댓글 상세 init
  initGlobalEventDelegation(postId, () => initCommentSection(postId));
  initLikeButton();           // 좋아요 이벤트 등록
});

/**
 * 게시물 상세 조회
 */
async function loadPostDetail() {
  try {
    const response = await fetch(`${window.BACKEND_URL}/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      showToast("⚠️ 로그인이 필요합니다!", "warning");  // 🔥 변경
      return;
    }

    const data = await response.json();

    document.getElementById("title").textContent = data.title;
    document.getElementById("text").textContent = data.text;
    document.getElementById("createdUserNickName").textContent = data.nickname;
    document.getElementById("createdAt").textContent = new Date(data.createdAt).toLocaleString();
    document.getElementById("likeCount").textContent = data.likeCount;
    document.getElementById("lookCount").textContent = data.lookCount;
    document.getElementById("commentCount").textContent = data.commentCount;

    // 프로필 이미지
    const profileImg = document.querySelector(".profile .left img");
    profileImg.src = data.profileImage || "/user.png";

    // 게시물 이미지
    const postImg = document.querySelector(".image-box img");
    postImg.src = data.postImage || "/Default-PostImage.jpeg";

  } catch (error) {
    console.error("게시물 조회 중 오류:", error);
    showToast("🚨 게시물 정보를 불러오지 못했습니다!", "error"); // 🔥 변경
  }
}

/* -----------------------------------------------------------
 * 좋아요 버튼 로직
 * -----------------------------------------------------------*/
function initLikeButton() {
  const likeButton = document.getElementById("likeButton");
  const likeCountEl = document.getElementById("likeCount");

  likeButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${window.BACKEND_URL}/api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        showToast("⚠️ 로그인이 필요합니다!", "warning");  // 🔥 변경
        return;
      }

      const result = await response.text();
      let currentCount = parseInt(likeCountEl.textContent || "0");

      if (result.includes("생성")) {
        likeCountEl.textContent = currentCount + 1;
        likeButton.textContent = "💔 좋아요 취소";
        showToast("❤️ 좋아요!", "success");  // 🔥 성공 토스트
      } 
      else if (result.includes("제거")) {
        likeCountEl.textContent = Math.max(0, currentCount - 1);
        likeButton.textContent = "❤️ 좋아요";
        showToast("💔 좋아요 취소됨!", "success"); // 🔥 성공 토스트
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      showToast("🚨 좋아요 요청 실패!", "error");  // 🔥 변경
    }
  });
}
