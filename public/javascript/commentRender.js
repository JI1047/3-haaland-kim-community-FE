/**
 * 댓글 렌더링 및 무한스크롤 전용 메서드 분리
 */
import { loadComments } from "./commentService.js";
import { showToast } from "../common/toast.js";   // ✅ 추가됨

let commentPage = 0;
let commentSize = 5;
let isCommentLoading = false;
let isCommentLast = false;

export function initCommentSection(postId) {
  commentPage = 0;
  isCommentLast = false;

  const commentList = document.getElementById("commentList");
  commentList.innerHTML = "";
  loadAndRenderComments(postId);

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      loadAndRenderComments(postId);
    }
  });
}

/**
 * 댓글 로드 + 렌더링
 */
async function loadAndRenderComments(postId) {
  if (isCommentLoading || isCommentLast) return;
  isCommentLoading = true;

  const loader = document.getElementById("loader");
  loader.style.display = "block";

  try {
    const data = await loadComments(postId, commentPage, commentSize);
    renderComments(data.comments);
    isCommentLast = data.last;
    commentPage++;
  } catch (err) {
    console.error("댓글 로드 실패:", err);

    // ✅ 에러 메시지 토스트로 출력
    showToast("🚨 댓글을 불러오는 중 오류가 발생했습니다!", "error");
  } finally {
    loader.style.display = "none";
    isCommentLoading = false;
  }
}

/**
 * 댓글 렌더링
 */
function renderComments(comments) {
  const commentList = document.getElementById("commentList");

  comments.forEach((comment) => {
    const div = document.createElement("div");
    div.className = "comment-card";

    div.innerHTML = `
      <div class="comment-header">
        <img src="${comment.profileImage || "/images/default-profile.png"}" class="profile-image">
        <b>${comment.nickname}</b>
      </div>
      <div class="comment-body">${comment.text}</div>
      <div class="comment-actions">
        <button class="edit-btn" data-id="${comment.commentId}">수정</button>
        <button class="delete-btn" data-id="${comment.commentId}">삭제</button>
      </div>
      <hr>
    `;

    commentList.appendChild(div);
  });
}
