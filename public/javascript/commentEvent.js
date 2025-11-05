/**
 * 댓글 이벤트 위임 관련 로직 분리
 * commentService,checkWrither import통해 재사용
 * 클릭 이벤트를 중앙에서 처리 (이벤ㄴ트 위임)
 */
import { createComment, updateComment, deleteComment } from "./commentService.js";
import { checkWriterPermission } from "./checkWriter.js";

const BASE_URL = window.BACKEND_URL || "http://localhost:8080";


/**
 * 전역 이벤트 위임 등록
 * - 게시물 수정/삭제 버튼 클릭
 * - 댓글 작성/수정/삭제 버튼 클릭
 * @param {number} postId - 현재 게시물 ID
 * @param {Function} refreshComments - 댓글 영역 갱신 함수
 */
export function initGlobalEventDelegation(postId, refreshComments) {
  document.body.addEventListener("click", async (e) => {
    const target = e.target;

    //게시물 수정 버튼
    if (target.id === "updatePostButton") return handleUpdatePost(postId);

    //게시물 삭제 버튼
    if (target.id === "deletePostButton") return handleDeletePost(postId);

    //댓글 작성 버튼
    if (target.id === "createCommentButton") return handleCreateComment(postId, refreshComments);

    //댓글 수정 버튼 클릭 시
    if (target.classList.contains("edit-btn")) {
      const commentId = target.dataset.id;

      //기존 내용 불러오기 및 수정 프롬포트 표시
      const card = target.closest(".comment-card");
      const oldText = card.querySelector(".comment-body").textContent.trim();
      const newText = prompt("수정할 내용을 입력하세요:", oldText);

      //입력값이 유효하면 서버 요청
      if (newText && newText !== oldText) {
        const result = await updateComment(postId, commentId, newText);

        //에러 발생 시 서버에서 설정한 에러 메세지 반환
        if (!result.ok) {
            alert(result.message || "댓글 수정 권한이 없습니다.");
            return;
        }

        //댓글 새로고침
        refreshComments();
      }
    }

    //댓글 삭제 버튼 클릭 시
    if (target.classList.contains("delete-btn")) {
      const commentId = target.dataset.id;

      //사용자 확인 후 서버 요청
      if (confirm("정말 삭제하시겠습니까?")) {
        const result = await deleteComment(postId, commentId);

        //에러 발생 시 서버에서 설정한 에러 메세지 반환
        if (!result.ok) {
            alert(result.message || "댓글 삭제 권한이 없습니다.");
            return;
        }

        //댓글 새로고침
        refreshComments();
      }
    }
  });
}

/**
 * 게시물 수정 처리
 * - 작성자 검증 후 수정 페이지로 이동
 * @param {number} postId 
 */
async function handleUpdatePost(postId) {
  const check = await checkWriterPermission(postId);
  if (check.ok && check.match) {
    location.href = `/updatePost?id=${postId}`;
  } else {
    alert(check.message || "수정 권한이 없습니다.");
  }
}

/**
 * 게시물 삭제 처리
 * 작성자 검증 후 삭제 요청 수행
 * @param {number} postId 
 * @returns 
 */
async function handleDeletePost(postId) {
  const check = await checkWriterPermission(postId);
  //작성자 불일치 시. ㅓㅂ근 차단
  if (!check.ok || !check.match) return alert(check.message || "삭제 권한이 없습니다.");

  //사용자 확인 후 삭제 요청
  if (confirm("정말 삭제하시겠습니까?")) {
    const res = await fetch(`${BASE_URL}/api/posts/${postId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    res.ok ? (alert("삭제 완료"), (location.href = "/getPostList")) : alert("삭제 실패");
  }
}

/**
 * 댓글 생성 처리
 * - 입력값 검증 후 서버에 생성 요청
 * @param {number} postId 
 * @param {Function} refreshComments 
 * @returns 
 */
async function handleCreateComment(postId, refreshComments) {
  const text = document.getElementById("commentInput").value.trim();

  //빈 내용 차단
  if (!text) return alert("댓글 내용을 입력해주세요!");

  //서버 요청
  const res = await createComment(postId, text);

  //성공 시 입력창 초기화 및 댓글 새로 고침
  if (res.ok) {
    alert("댓글이 등록되었습니다.");
    document.getElementById("commentInput").value = "";
    refreshComments();
  } else {
    alert("댓글 등록 실패");
  }
}
