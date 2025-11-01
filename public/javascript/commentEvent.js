/**
 * 댓글 이벤트 위임 관련 로직 분리
 * commentService,checkWrither import통해 재사용
 */
import { createComment, updateComment, deleteComment } from "./commentService.js";
import { checkCommentWriter, checkWriterPermission } from "./checkWriter.js";

export function initGlobalEventDelegation(postId, refreshComments) {
  document.body.addEventListener("click", async (e) => {
    const target = e.target;

    if (target.id === "updatePostButton") return handleUpdatePost(postId);
    if (target.id === "deletePostButton") return handleDeletePost(postId);
    if (target.id === "createCommentButton") return handleCreateComment(postId, refreshComments);

    if (target.classList.contains("edit-btn")) {
      const commentId = target.dataset.id;
      const check = await checkCommentWriter(postId, commentId);
      if (!check.match) return alert(check.message || "댓글 수정 권한이 없습니다.");

      const card = target.closest(".comment-card");
      const oldText = card.querySelector(".comment-body").textContent.trim();
      const newText = prompt("수정할 내용을 입력하세요:", oldText);
      if (newText && newText !== oldText) {
        await updateComment(postId, commentId, newText);
        refreshComments();
      }
    }

    if (target.classList.contains("delete-btn")) {
      const commentId = target.dataset.id;
      const check = await checkCommentWriter(postId, commentId);
      if (!check.match) return alert(check.message || "댓글 삭제 권한이 없습니다.");

      if (confirm("정말 삭제하시겠습니까?")) {
        await deleteComment(postId, commentId);
        refreshComments();
      }
    }
  });
}

async function handleUpdatePost(postId) {
  const check = await checkWriterPermission(postId);
  if (check.ok && check.match) {
    location.href = `/updatePost?id=${postId}`;
  } else {
    alert(check.message || "수정 권한이 없습니다.");
  }
}

async function handleDeletePost(postId) {
  const check = await checkWriterPermission(postId);
  if (!check.ok || !check.match) return alert(check.message || "삭제 권한이 없습니다.");

  if (confirm("정말 삭제하시겠습니까?")) {
    const res = await fetch(`http://localhost:8080/api/posts/${postId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    res.ok ? (alert("삭제 완료"), (location.href = "/getPostList")) : alert("삭제 실패");
  }
}

async function handleCreateComment(postId, refreshComments) {
  const text = document.getElementById("commentInput").value.trim();
  if (!text) return alert("댓글 내용을 입력해주세요!");

  const res = await createComment(postId, text);
  if (res.ok) {
    alert("댓글이 등록되었습니다.");
    document.getElementById("commentInput").value = "";
    refreshComments();
  } else {
    alert("댓글 등록 실패");
  }
}
