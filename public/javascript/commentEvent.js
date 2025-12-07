import { createComment, updateComment, deleteComment } from "./commentService.js";
import { checkWriterPermission } from "./checkWriter.js";
import { showToast } from "../common/toast.js";

const BASE_URL = window.BACKEND_URL || "http://localhost:8080";

export function initGlobalEventDelegation(postId, refreshComments) {

  document.body.addEventListener("click", async (e) => {
    const target = e.target;

    /** ---------------------------
     * 댓글 작성
     ----------------------------*/
    if (target.id === "createCommentButton") {
      return handleCreateComment(postId, refreshComments);
    }


    /** ---------------------------
     * 댓글 수정 버튼 누름 → 수정 모드 ON
     ----------------------------*/
    if (target.classList.contains("edit-btn")) {
      const card = target.closest(".comment-card");
      toggleEditMode(card, true);
      return;
    }

    /** ---------------------------
     * 수정 취소
     ----------------------------*/
    if (target.classList.contains("cancel-edit-btn")) {
      const card = target.closest(".comment-card");
      toggleEditMode(card, false);
      return;
    }

    /** ---------------------------
     * 수정 저장
     ----------------------------*/
    if (target.classList.contains("save-edit-btn")) {
      const card = target.closest(".comment-card");
      const commentId = target.dataset.id;

      const newText = card.querySelector(".edit-area").value.trim();

      if (!newText) {
        showToast("댓글 내용을 입력해주세요!", "warning");
        return;
      }

      const result = await updateComment(postId, commentId, newText);

      if (result.status === 401) {
        showToast("로그인이 필요합니다!", "error");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      if (!result.ok) {
        showToast(result.message || "수정 권한이 없습니다.", "error");
        return;
      }

      showToast("댓글이 수정되었습니다!", "success");
      refreshComments();
      return;
    }


    /** ---------------------------
     * 댓글 삭제
     ----------------------------*/
    if (target.classList.contains("delete-btn")) {
      const commentId = target.dataset.id;

      if (!confirm("정말 삭제하시겠습니까?")) return;

      const result = await deleteComment(postId, commentId);

      if (result.status === 401) {
        showToast("로그인이 필요합니다!", "error");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      if (!result.ok) {
        showToast(result.message || "삭제 권한이 없습니다.", "error");
        return;
      }

      showToast("댓글이 삭제되었습니다!", "success");
      refreshComments();
    }
  });
}

/**
 * 댓글 생성
 */
async function handleCreateComment(postId, refreshComments) {
  const text = document.getElementById("commentInput").value.trim();
  if (!text) {
    showToast("댓글 내용을 입력해주세요!", "warning");
    return;
  }

  const res = await createComment(postId, text);

  if (res.status === 401) {
    showToast("로그인이 필요합니다!", "warning");
    setTimeout(() => window.location.href = "/login", 1000);
    return;
  }

  if (!res.ok) {
    showToast(res.message || "댓글 등록 실패", "error");
    return;
  }

  showToast("댓글이 등록되었습니다!", "success");
  document.getElementById("commentInput").value = "";
  refreshComments();
}

/**
 * 수정 모드 토글
 */
function toggleEditMode(card, isEdit) {
  card.querySelector(".comment-text").style.display = isEdit ? "none" : "block";
  card.querySelector(".edit-area").style.display = isEdit ? "block" : "none";
  card.querySelector(".edit-actions").style.display = isEdit ? "block" : "none";
}
