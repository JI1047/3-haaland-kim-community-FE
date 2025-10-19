/**
 *  게시물 상세 조회 시 fetch 연결 요청
 * 1. 게시물 상세 조회 페이지에 접근했을 때 실행되는 fetch 요청
 * 2. URL의 쿼리 파라미터(id)를 추출하여 postId 변수에 저장
 * 3,  http://127.0.0.1:8080/api/posts/${postId}로 백엔드 GET요청을 보냄
 * 3. 세션 쿠키를 포함하기 위헤 credentials: "include"로 설정
 * 4. 서버로부터 받은 게시물 정보를 HTML 요소(id=title, id=text 등등)에 표시
 * 5. updatePostButton id로 설정된 게시물 수정 버튼을 클릭 했을 때 이동할 수 있도록 이벤트 리스너 생성
 * 5. 응답 오류 발생 시 경고창 또는 콘솔을 통해 오류 메시지를 표시
 */
document.addEventListener("DOMContentLoaded", async () => {
    
    const urlParam = new URLSearchParams(window.location.search);
    const postId = urlParam.get("id");

  try {
    const response = await fetch(`http://127.0.0.1:8080/api/posts/${postId}`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      alert("로그인이 필요합니다.");
      return;
    }

    const data = await response.json();
    document.getElementById("title").textContent = data.title;
    document.getElementById("text").textContent = data.text;
    document.getElementById("createdUserNickName").textContent = data.nickname;
    document.getElementById("createdAt").textContent = new Date(data.createdAt).toLocaleString();
    document.getElementById("likeCount").textContent = data.likeCount;
    document.getElementById("lookCount").textContent = data.lookCount;
    document.getElementById("commentCount").textContent = data.commentCount;

     document.getElementById("updatePostButton").addEventListener("click", () => {
      location.href = `updatePost.html?id=${postId}`;
    });
  } catch (error) {
    console.error("에러:", error);
  }
});

