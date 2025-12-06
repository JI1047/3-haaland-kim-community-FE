/**
 * 댓글 이벤트 위임 관련 로직 분리
 */
import { createComment, updateComment, deleteComment } from "./commentService.js";
import { checkWriterPermission } from "./checkWriter.js";
import { showToast } from "../common/toast.js";   // 🔥 추가된 부분

const BASE_URL = window.BACKEND_URL || "http://localhost:8080";

export function initGlobalEventDelegation(postId, refreshComments) {
  document.body.addEventListener("click", async (e) => {
    const target = e.target;

    // 게시물 수정 버튼
    if (target.id === "updatePostButton") return handleUpdatePost(postId);

    // 게시물 삭제 버튼
    if (target.id === "deletePostButton") return handleDeletePost(postId);

    // 댓글 작성 버튼
    if (target.id === "createCommentButton")
      return handleCreateComment(postId, refreshComments);

    // 댓글 수정 버튼
    if (target.classList.contains("edit-btn")) {
      const commentId = target.dataset.id;

      const card = target.closest(".comment-card");
      const oldText = card.querySelector(".comment-body").textContent.trim();
      const newText = prompt("수정할 내용을 입력하세요:", oldText);

      if (newText && newText !== oldText) {
        const result = await updateComment(postId, commentId, newText);

        if (!result.ok) {
          showToast(result.message || "댓글 수정 권한이 없습니다.", "error");  // 🔥 변경
          return;
        }

        refreshComments();
        showToast("댓글이 수정되었습니다!", "success");  // 🔥 성공 메시지 추가
      }
    }

    // 댓글 삭제 버튼
    if (target.classList.contains("delete-btn")) {
      const commentId = target.dataset.id;

      if (confirm("정말 삭제하시겠습니까?")) {
        const result = await deleteComment(postId, commentId);

        if (!result.ok) {
          showToast(result.message || "댓글 삭제 권한이 없습니다.", "error"); // 🔥 변경
          return;
        }

        refreshComments();
        showToast("댓글이 삭제되었습니다!", "success");  // 🔥 성공 메시지
      }
    }
  });
}

/**
 * 게시물 수정
 */
async function handleUpdatePost(postId) {
  const check = await checkWriterPermission(postId);

  if (check.ok && check.match) {
    location.href = `/updatePost?id=${postId}`;
  } else {
    showToast("작성자가 아닙니다.", "error");   // ✅ 강제 고정 메시지
  }
}

/**
 * 게시물 삭제
 */
async function handleDeletePost(postId) {
  const check = await checkWriterPermission(postId);

  if (!check.ok || !check.match) {
    showToast("작성자가 아닙니다.", "error");   // ✅ 강제 고정 메시지
    return;
  }

  if (confirm("정말 삭제하시겠습니까?")) {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      showToast("게시글이 삭제되었습니다!", "success");  // 🔥 변경
      location.href = "/getPostList";
    } else {
      showToast("삭제 실패", "error");  // 🔥 변경
    }
  }
}

/**
 * 댓글 생성
 */
async function handleCreateComment(postId, refreshComments) {
  const text = document.getElementById("commentInput").value.trim();

  if (!text) {
    showToast("댓글 내용을 입력해주세요!", "warning");   // 🔥 변경
    return;
  }

  const res = await createComment(postId, text);

  if (res.ok) {
    showToast("댓글이 등록되었습니다!", "success");  // 🔥 성공
    document.getElementById("commentInput").value = "";
    refreshComments();
  } else {
    showToast("댓글 등록 실패", "error");  // 🔥 변경
  }
}
