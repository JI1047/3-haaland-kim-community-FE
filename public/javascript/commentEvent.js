import { createComment, updateComment, deleteComment } from "./commentService.js";
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
     * 댓글 수정
     ----------------------------*/
    if (target.classList.contains("edit-btn")) {
      const card = target.closest(".comment-card");
      const commentId = target.dataset.id;
      const originalText = card.querySelector(".comment-text").textContent.trim();

      const { value: newText } = await Swal.fire({
        title: "댓글 수정",
        input: "textarea",
        inputValue: originalText,
        showCancelButton: true,
        confirmButtonText: "수정",
        cancelButtonText: "취소",
        inputValidator: (value) => {
          if (!value.trim()) {
            return "댓글 내용을 입력해주세요!";
          }
        },
      });

      if (newText) {
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
      }
    }


    /** ---------------------------
     * 댓글 삭제
     ----------------------------*/
    if (target.classList.contains("delete-btn")) {
      const commentId = target.dataset.id;

      const { isConfirmed } = await Swal.fire({
        title: "정말 삭제하시겠습니까?",
        text: "삭제된 댓글은 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      });

      if (isConfirmed) {
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
