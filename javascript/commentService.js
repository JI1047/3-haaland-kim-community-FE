/**
 * 게시물 조회 페이지에서 댓글 CRUD API fetch 연결 관련 메서드 분리
 * 댓글 관련 API 요청 전용 모듈
 * 서버와의 fetch 요청을 통해 댓글 데이터를 관리
 * 1) 댓글 불러오기
 * 2) 댓글 생성
 * 3) 댓글 수정(업데이트)
 * 4) 댓글 삭제
 */

const BASE_URL = window.BACKEND_URL || "http://localhost:8080";


/**
 * 댓글 불러오기
 * - 지정된 게시물 ID와 페이지 정보로 댓글 목록을 조회
 */
export async function loadComments(postId, page, size) {
  const res = await fetch(
    `${BASE_URL}/api/${postId}/comments?page=${page}&size=${size}`,
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
  const res = await fetch(`${BASE_URL}/api/${postId}/comments`, {
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
 * - 서버의 에러 메시지도 함께 반환 (ex: 작성자 불일치, 인증 만료 등)
 */
export async function updateComment(postId, commentId, newText) {
  try {
    const res = await fetch(
    `${BASE_URL}/api/${postId}/comments/${commentId}`,      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      }
    );

    // 응답 본문(JSON) 파싱 시도
    const data = await res.json().catch(() => null);

    // HTTP 상태와 메시지를 함께 반환
    return {
      ok: res.ok,
      status: res.status,
      message: data?.message || (res.ok ? "댓글 수정 성공" : "댓글 수정 실패"),
    };
  } catch (err) {
    console.error("댓글 수정 요청 중 오류:", err);
    return { ok: false, status: 500, message: "서버 통신 오류" };
  }
}

/**
 * 댓글 삭제
 * - 지정된 댓글 ID를 서버에 전달하여 삭제 요청 수행
 */
export async function deleteComment(postId, commentId) {
  try {
    const res = await fetch(`${BASE_URL}/api/${postId}/comments/${commentId}`, {
       method: "DELETE", credentials: "include" }
    );

    // JSON 파싱 시도
    const data = await res.json().catch(() => null);

    return {
      ok: res.ok,
      status: res.status,
      message: data?.message || (res.ok ? "댓글 삭제 성공" : "댓글 삭제 실패"),
    };
  } catch (err) {
    console.error("댓글 삭제 요청 중 오류:", err);
    return { ok: false, status: 500, message: "서버 통신 오류" };
  }
}

