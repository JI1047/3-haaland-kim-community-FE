/**
 * 게시물 조회 페이지에서 댓글 CRUD API fetch 연결 관련 메서드 분리
 * 댓글 관련 API 요청 전용 모듈
 * 서버와의 fetch 요청을 통해 댓글 데이터를 관리
 * 1) 댓글 불러오기
 * 2) 댓글 생성
 * 3) 댓글 수정(업데이트)
 * 4) 댓글 삭제
 */


/**
 * 댓글 불러오기
 * - 지정된 게시물 ID와 페이지 정보로 댓글 목록을 조회
 */
export async function loadComments(postId, page, size) {
  const res = await fetch(
    `http://localhost:8080/api/${postId}/comments?page=${page}&size=${size}`,
    { method: "GET", credentials: "include" }
  );
  if (!res.ok) throw new Error("댓글 로드 실패");
  return await res.json();
}

/**
 * 댓글 생성
 * - 사용자가 입력한 내용을 서버로 전송하여 새 댓글 등록
 */
export async function createComment(postId, text) {
  const res = await fetch(`http://localhost:8080/api/${postId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res;
}

/**
 * 댓글 수정(업데이트)
 * - 댓글 ID와 수정된 텍스트를 서버에 전송하여 내용 갱신
 */
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

/**
 * 댓글 삭제
 * - 지정된 댓글 ID를 서버에 전달하여 삭제 요청 수행
 */
export async function deleteComment(postId, commentId) {
  const res = await fetch(
    `http://localhost:8080/api/${postId}/comments/${commentId}`,
    { method: "DELETE", credentials: "include" }
  );
  return res;
}

