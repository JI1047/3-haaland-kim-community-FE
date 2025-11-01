import { initCommentSection } from "./commentRender.js";
import { initGlobalEventDelegation } from "./commentEvent.js";

let postId;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  await loadPostDetail();
  initCommentSection(postId);
  initGlobalEventDelegation(postId, () => initCommentSection(postId));
});

async function loadPostDetail() {
  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
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
  } catch (error) {
    console.error("게시물 조회 중 오류:", error);
  }
}
