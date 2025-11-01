/**
 * 작성자, 로그인 한 사용자 검증 메서드 분리
 * 게시물 및 댓글 작성자와 로그인 한 사용자 일치 여부 확인
 * 1) 게시물 작성자와 로그인한 사용자 검증
 * 2) 댓글 작성자와 로그인 한 사용자 검증
 */
export async function checkWriterPermission(postId) {
  const res = await fetch(
    `http://localhost:8080/api/posts/${postId}/check-writer`,
    { method: "GET", credentials: "include" }
  );
  const data = await res.json().catch(() => null);
  return { ok: res.ok, match: data?.match, message: data?.message };
}

export async function checkCommentWriter(postId, commentId) {
  const res = await fetch(
    `http://localhost:8080/api/${postId}/comments/${commentId}/check-writer`,
    { method: "GET", credentials: "include" }
  );
  const data = await res.json().catch(() => null);
  return { ok: res.ok, match: data?.match, message: data?.message };
}