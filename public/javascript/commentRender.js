/**
 * 댓글 렌더링 및 무한스크롤 전용 메서드 분리
 * commentService를 import해서 사용
 * 댓글 렌더링, 페이지네이션, 스크롤 이벤트 담당
 */

import { loadComments } from "./commentService.js";

/**
 * 댓글 페이지네이션 상태 관리 변수
 */
let commentPage = 0;//시작 페이지
let commentSize = 5;//한번에 불러올 댓글 수
let isCommentLoading = false;//로딩중인가?
let isCommentLast = false;//마지막 페이지인가?

/**
 * 댓글 섹션 초기화
 * - 첫 페이지부터 댓글 로드
 * - 무한 스크롤 이벤트 등록
 */
export function initCommentSection(postId) {
  commentPage = 0;
  isCommentLast = false;

  const commentList = document.getElementById("commentList");
  commentList.innerHTML = "";
  loadAndRenderComments(postId);

  //스크롤 바닥 도달 시 다음 페이지 자동 로드
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
    ) {
      loadAndRenderComments(postId);
    }
  });
}

/**
 * 댓글 데이터 로드 및 렌더링
 * - 서버에서 댓글 페이지 응답데이터dto를 받아와 화면에 렌더링
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
  } finally {
    loader.style.display = "none";
    isCommentLoading = false;
  }
}

/**
 * 댓글 렌더링
 * 댓글 데이터를 기반으로 DOM 요소 생성 및 삽입 
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
