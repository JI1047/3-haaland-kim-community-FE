/**
 * 댓글 렌더링 및 무한스크롤 전용 메서드 분리
 */
import { loadComments } from "./commentService.js";
import { showToast } from "../common/toast.js";

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

    const actionButtons = comment.owner
      ? `
        <div class="comment-actions">
          <button class="edit-btn" data-id="${comment.commentId}">수정</button>
          <button class="delete-btn" data-id="${comment.commentId}">삭제</button>
        </div>
      `
      : "";

    div.innerHTML = `
      <div class="comment-header">
        <img src="${comment.profileImage || "/user.png"}" class="profile-image">
        <b>${comment.nickname}</b>
      </div>

      <div class="comment-body" data-id="${comment.commentId}">
        <span class="comment-text">${comment.text}</span>

        <!-- 🔥 수정 입력창 (기본 숨김) -->
        <textarea class="edit-area" style="display:none;">${comment.text}</textarea>
        <div class="edit-actions" style="display:none;">
          <button class="save-edit-btn" data-id="${comment.commentId}">저장</button>
          <button class="cancel-edit-btn">취소</button>
        </div>
      </div>

      ${actionButtons}
      <hr>
    `;

    commentList.appendChild(div);
  });
}
