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

