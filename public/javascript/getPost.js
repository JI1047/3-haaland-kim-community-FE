/**
 * 게시물 상세 페이지 
 * 1) 게시물 상세 조회
 * 2) 댓글 섹션 초기화
 * 3) 전역 이벤트ㅡ 위임 등록
 */
import { initCommentSection } from "./commentRender.js"; // 댓글 렌더링 및 무한 스크롤 초기화 js 파일 import
import { initGlobalEventDelegation } from "./commentEvent.js"; // 댓글/게시물 이벤트 위임 로직 js 파일 import

let postId;//현재 게시물 ID (URL 파라미터로부터 추출)

/**
 * 초기 실행: 페이지 로드 완료 시 호출
 */
document.addEventListener("DOMContentLoaded", async () => {

  //URL 파라미터에서 postId추출
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  //게시물 상세 데이터 로드
  await loadPostDetail();

  //댓글 섹션 초기화 (댓글 목록 + 스크롤 이벤트)
  initCommentSection(postId);

  // 전역 이벤트 위임 등록(댓글 수정/삭세/생성 + 게시물 수정/삭제)
  initGlobalEventDelegation(postId, () => initCommentSection(postId));
  initLikeButton();//좋아요 이벤트 등록
});

/**
 * 게시물 상세 조회
 * 1) 서버로무터 게시물 응답dto 데이터를 응답받고
 * 2) 화면에 렌더링
 */
async function loadPostDetail() {
  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    });

    //로그인하지않은(인증되지않은)사용자의 접근 차단
    if (!response.ok) {
      alert("로그인이 필요합니다.");
      return;
    }

    //게시물 응답dto로부터 받은 데이터 렌더링
    const data = await response.json();
    document.getElementById("title").textContent = data.title;
    document.getElementById("text").textContent = data.text;
    document.getElementById("createdUserNickName").textContent = data.nickname;
    document.getElementById("createdAt").textContent = new Date(data.createdAt).toLocaleString();
    document.getElementById("likeCount").textContent = data.likeCount;
    document.getElementById("lookCount").textContent = data.lookCount;
    document.getElementById("commentCount").textContent = data.commentCount;
    // 작성자 프로필 이미지 렌더링
    const profileImg = document.querySelector(".profile .left img");
    profileImg.src = data.profileImage || "/user.png";

    // 게시물 이미지 렌더링
    const postImg = document.querySelector(".image-box img");
    postImg.src = data.postImage || "/Default-PostImage.jpeg";
  } catch (error) {
    console.error("게시물 조회 중 오류:", error);
  }
}
/* -----------------------------------------------------------
 * 좋아요 버튼 로직
 * -----------------------------------------------------------*/
function initLikeButton() {
  const likeButton = document.getElementById("likeButton");
  const likeCountEl = document.getElementById("likeCount");

  likeButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        alert("로그인이 필요합니다.");
        return;
      }

      const result = await response.text();
      let currentCount = parseInt(likeCountEl.textContent || "0");

      // 서버 응답에 따라 UI 변경
      if (result.includes("생성")) {
        likeCountEl.textContent = currentCount + 1;
        likeButton.textContent = "💔 좋아요 취소";
      } else if (result.includes("제거")) {
        likeCountEl.textContent = Math.max(0, currentCount - 1);
        likeButton.textContent = "❤️ 좋아요";
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      alert("좋아요 요청 중 오류가 발생했습니다.");
    }
  });
}