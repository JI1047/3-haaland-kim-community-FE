/**
 * 게시물 상세 페이지 
 * 1) 게시물 상세 조회
 * 2) 댓글 섹션 초기화
 * 3) 전역 이벤트 위임 등록
 * 
 * 
 */
import { initCommentSection } from "./commentRender.js";
import { initGlobalEventDelegation } from "./commentEvent.js";
import { showToast } from "../common/toast.js";  // 🔥 토스트 추가

let postId;
let isOwner = false;

// 초기 실행
document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();     // 게시물 상세 조회
  initCommentSection(postId); // 댓글 상세 init
  initGlobalEventDelegation(postId, () => initCommentSection(postId));
  initLikeButton();           // 좋아요 이벤트 등록
  initPostActions();          // 수정/삭제 버튼 로직
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
      showToast("⚠️ 로그인이 필요합니다!", "warning");
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

    // ⭐️ 좋아요 초기 상태 설정
    const likeButton = document.getElementById("likeButton");
    likeButton.textContent = data.hasLiked ? "💔 좋아요 취소" : "❤️ 좋아요";

    // 🔒 작성자만 수정/삭제 노출
    isOwner = Boolean(data.owner);
    togglePostActions(isOwner);

    // 데이터 로드 완료 후 본문 표시
    const postContent = document.getElementById("postContent");
    if (postContent) postContent.style.display = "block";

  } catch (error) {
    console.error("게시물 조회 중 오류:", error);
    showToast("🚨 게시물 정보를 불러오지 못했습니다!", "error");
  }
}

/* -----------------------------------------------------------
 * 게시글 수정/삭제 버튼
 * -----------------------------------------------------------*/
function initPostActions() {
  if (!isOwner) return; // 작성자가 아니면 버튼 이벤트 자체를 막음

  const updateBtn = document.getElementById("updatePostButton");
  const deleteBtn = document.getElementById("deletePostButton");

  if (updateBtn) {
    updateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/updatePost?id=${postId}`;
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmed = await Swal.fire({
        title: "게시글을 삭제할까요?",
        text: "삭제 후에는 되돌릴 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        confirmButtonColor: "#d33",
      }).then((result) => result.isConfirmed);

      if (!confirmed) return;

      try {
        const res = await fetch(  `${window.BACKEND_URL}/api/posts/${postId}/delete`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.status === 401) {
          showToast("로그인이 필요합니다.", "warning");
          setTimeout(() => (window.location.href = "/login"), 800);
          return;
        }

        if (!res.ok) {
          const msg = (await res.text()) || "삭제 권한이 없습니다.";
          showToast(msg, "error");
          return;
        }

        showToast("게시글이 삭제되었습니다.", "success");
        setTimeout(() => (window.location.href = "/getPostList"), 800);
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
        showToast("삭제 중 오류가 발생했습니다.", "error");
      }
    });
  }
}

// 소유자 여부에 따라 수정/삭제 버튼 영역을 토글
function togglePostActions(owner) {
  const actionBox = document.querySelector(".profile .right");
  if (!actionBox) return;

  actionBox.style.display = owner ? "flex" : "none";
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
