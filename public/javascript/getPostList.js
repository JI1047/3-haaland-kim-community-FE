const postList = document.getElementById("postList");
const loader = document.getElementById("loader");

let page = 0;
let size = 5;
let isLoading = false;
let isLast = false;

// 게시글 렌더링
function renderPosts(posts) {
  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-meta">
        ${post.nickname} | ${new Date(post.createdAt).toLocaleString()} <br>
        좋아요수: ${post.likeCount} 댓글 수: ${post.commentCount} 조회 수: ${post.lookCount}
      </div>
    `;
    div.addEventListener("click", () => {
      window.location.href = `/getPost?id=${post.postId}`;
    });
    postList.appendChild(div);
  });
}

// 게시글 불러오기
async function loadPosts() {
  if (isLoading || isLast) return;
  isLoading = true;
  loader.style.display = "block";


  try {
    const res = await fetch(`${window.BACKEND_URL}/api/posts/list?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("게시글 로드 실패");

    const data = await res.json();
    console.log("✅ 응답 데이터:", data);

    renderPosts(data.posts);
    isLast = !data.hasMore; // hasMore=false면 마지막 페이지
    page++;

    loader.textContent = isLast ? "마지막 페이지입니다" : "스크롤하면 더 불러옵니다";
  } catch (err) {
    showToast("💥 게시글을 불러오는 중 문제가 생겼어요!", "error");
    loader.textContent = "에러 발생";
  } finally {
    isLoading = false;
  }
}

// IntersectionObserver
const observer = new IntersectionObserver(entries => {
  const target = entries[0];
  if (target.isIntersecting && !isLoading && !isLast) loadPosts();
});

observer.observe(loader);

// 첫 페이지 로드
window.addEventListener("DOMContentLoaded", loadPosts);
