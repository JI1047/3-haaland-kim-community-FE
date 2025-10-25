let postId;

/**
 * 게시물 상세 조회 및 댓글 인피니티 스크롤 통합 스크립트
 */
document.addEventListener("DOMContentLoaded", async () => {

  const urlParam = new URLSearchParams(window.location.search);
  postId = urlParam.get("id");

  // 🔹 게시물 상세 조회
  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
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
      location.href = `/updatePost?id=${postId}`;
    });

    // 🔹 게시물 로딩 완료 후 댓글 로드 시작
    initCommentSection();

  } catch (error) {
    console.error("에러:", error);
  }
});

// 🔹 게시물 삭제
document.getElementById("deletePostButton").addEventListener("click", async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}/delete`, {
      method: "DELETE",
      credentials: "include"
    });

    if (response.ok) {
      alert("게시물 삭제 성공!");
      location.href = "/getPostList";
    } else {
      alert("삭제 실패");
    }
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});

/* -------------------------------------------------
 * ✅ 댓글 인피니티 스크롤 영역
 * -------------------------------------------------*/
let commentPage = 0;
let commentSize = 5;
let isCommentLoading = false;
let isCommentLast = false;

const commentList = document.getElementById("commentList");
const loader = document.getElementById("loader");

/** 댓글 렌더링 함수 */
function renderComments(comments) {
  comments.forEach(comment => {
    const div = document.createElement("div");
    div.className = "comment-card";
    div.innerHTML = `
      <div class="comment-header">
        <img src="${comment.profileImage || '/images/default-profile.png'}" 
             alt="프로필" class="profile-image">
        <b>${comment.nickname}</b>
      </div>
      <div class="comment-body">${comment.text}</div>
      <div class="comment-actions">
        <button class="edit-btn" data-id="${comment.commentId}">수정</button>
        <button class="delete-btn" data-id="${comment.commentId}">삭제</button>
      </div>
      <hr>
    `;
    commentList.appendChild(div);
  });

  // 렌더링 후 이벤트 연결
  attachCommentButtonEvents();
}


/** 댓글 불러오기 */
async function loadComments() {
  if (isCommentLoading || isCommentLast) return;
  isCommentLoading = true;
  loader.style.display = "block";

  try {
    const res = await fetch(`http://localhost:8080/api/${postId}/comments?page=${commentPage}&size=${commentSize}`, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) throw new Error("댓글 로드 실패");
    const data = await res.json();
    console.log("✅ 응답 데이터:", data);


    renderComments(data.comments); // ✅ DTO key 이름 맞춤
    isCommentLast = data.last;
    commentPage++;

  } catch (error) {
    console.error("댓글 로드 중 오류:", error);
  } finally {
    loader.style.display = "none";
    isCommentLoading = false;
  }
}

/** 스크롤 이벤트 감지 → 하단 도달 시 다음 페이지 로드 */
function initCommentScroll() {
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      loadComments();
    }
  });
}

/** 댓글 초기화 함수 */
function initCommentSection() {
  commentPage = 0;
  commentList.innerHTML = "";
  isCommentLast = false;

  loadComments(); // 첫 페이지 로드
  initCommentScroll();
}
// 댓글 생성
document.getElementById("createCommentButton").addEventListener("click", async () => {
  const text = document.getElementById("commentInput").value.trim();

  if(!text){
    alert("댓글 내용을 입력해주세요!");
    return;
  }
  try {
    const response = await fetch(`http://localhost:8080/api/${postId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (response.ok) {
      alert("댓글 생성 성공!");
      document.getElementById("commentInput").value="";
      window.location.href = `/getPost?id=${postId}`;
    } else {
      alert("삭제 실패");
    }
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});
/** 댓글 수정/삭제 버튼 이벤트 연결 */
function attachCommentButtonEvents() {
  // 🔹 삭제 버튼 이벤트
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const commentId = e.target.dataset.id;

      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        const res =  await fetch(`http://localhost:8080/api/${postId}/comments/${commentId}`, {

          method: "DELETE",
          credentials: "include"
        });

        if (res.ok) {
          alert("댓글이 삭제되었습니다.");
          commentList.innerHTML = ""; // 초기화
          commentPage = 0;
          isCommentLast = false;
          await loadComments(); // 새로 불러오기
        } else {
          alert("댓글 삭제 실패");
        }
      } catch (err) {
        console.error("댓글 삭제 중 오류:", err);
      }
    });
  });

  // 🔹 수정 버튼 이벤트
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const commentId = e.target.dataset.id;
      const commentCard = e.target.closest(".comment-card");
      const body = commentCard.querySelector(".comment-body");
      const oldText = body.textContent.trim();

      const newText = prompt("수정할 내용을 입력하세요:", oldText);
      if (newText && newText !== oldText) {
        updateComment(commentId, newText);
      }
    });
  });
}

/** 댓글 수정 요청 */
async function updateComment(commentId, newText) {
  try {
    const res =  await fetch(`http://localhost:8080/api/${postId}/comments/${commentId}`, {

      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText })
    });

    if (res.ok) {
      alert("댓글이 수정되었습니다.");
      commentList.innerHTML = "";
      commentPage = 0;
      isCommentLast = false;
      await loadComments();
    } else {
      alert("수정 실패");
    }
  } catch (err) {
    console.error("댓글 수정 중 오류:", err);
  }
}
