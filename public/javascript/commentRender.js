/**
 * 댓글 렌더링 무한스크롤 전용 메서드 분리
 * commentService를 import해서 사용
 */

import { loadComments } from "./commentService.js";

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
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
    ) {
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
    console.error("댓글 로드 실패:", err);
  } finally {
    loader.style.display = "none";
    isCommentLoading = false;
  }
}

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
