/**
 * 게시물 조회 페이지에서 댓글 CRUD API fetch 연결 관련 메서드 분리
 * 댓글 관련 API 요청 전용 모듈
 * 1) 댓글 불러오기
 * 2) 댓글 생성
 * 3) 댓글 수정(업데이트)
 * 4) 댓글 삭제
 */

// 댓글 관련 API 요청 전용 모듈

export async function loadComments(postId, page, size) {
  const res = await fetch(
    `http://localhost:8080/api/${postId}/comments?page=${page}&size=${size}`,
    { method: "GET", credentials: "include" }
  );
  if (!res.ok) throw new Error("댓글 로드 실패");
  return await res.json();
}

export async function createComment(postId, text) {
  const res = await fetch(`http://localhost:8080/api/${postId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res;
}

export async function updateComment(postId, commentId, newText) {
  const res = await fetch(
    `http://localhost:8080/api/${postId}/comments/${commentId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    }
  );
  return res;
}

export async function deleteComment(postId, commentId) {
  const res = await fetch(
    `http://localhost:8080/api/${postId}/comments/${commentId}`,
    { method: "DELETE", credentials: "include" }
  );
  return res;
}

