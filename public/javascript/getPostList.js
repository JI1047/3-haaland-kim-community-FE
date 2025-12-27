const postList = document.getElementById("postList");
const loader = document.getElementById("loader");
const postPage = document.getElementById("postPage");

// 페이지 로드시 로그인 여부 체크
document.addEventListener("DOMContentLoaded", () => {
  checkLoginState();
});

let page = 0;
let size = 4;
let isLoading = false;
let isLast = false;
let pageShown = false;
const MIN_LOADING_MS = 400; // 로딩 체감을 위한 최소 표시 시간

/* -----------------------------------------------------------
 * 1. 로그인 상태에 따라 "게시글 작성" 버튼 표시/숨김

 * -----------------------------------------------------------*/
async function checkLoginState() {
  const btn = document.querySelector(".write-btn");

  try {
    const res = await fetch(`${window.BACKEND_URL}/api/jwt/validate`, {
      method: "GET",
      credentials: "include"
    });

    // 401 → 로그인 안 됨
    if (res.status === 401) {
      btn.style.display = "none";
      return;
    }

    const data = await res.json();
    if (!data.login) {
      btn.style.display = "none";
    }

  } catch (e) {
    btn.style.display = "none";
  }
}

/* -----------------------------------------------------------
 * 2. 게시글 렌더링
 * -----------------------------------------------------------*/
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

/* -----------------------------------------------------------
 * 3. 게시글 불러오기 (무한 스크롤)
 * -----------------------------------------------------------*/
async function loadPosts() {
  if (isLoading || isLast) return;
  isLoading = true;
  loader.style.display = "block";

  try {
    const fetchPromise = fetch(`${window.BACKEND_URL}/api/posts/list?page=${page}&size=${size}`);
    const delayPromise = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS));
    const res = await Promise.all([fetchPromise, delayPromise]).then(([r]) => r);
    if (!res.ok) throw new Error("게시글 로드 실패");

    const data = await res.json();
    renderPosts(data.posts);

    isLast = !data.hasMore;
    page++;

    loader.textContent = isLast ? "마지막 페이지입니다" : "스크롤하면 더 불러옵니다";

  } catch (err) {
    showToast("💥 게시글을 불러오는 중 문제가 생겼어요!", "error");
    loader.textContent = "에러 발생";

  } finally {
    if (!pageShown && postPage) {
      postPage.style.display = "block"; // 첫 로드 후에만 전체 페이지 노출
      pageShown = true;
    }
    isLoading = false;
  }
}

/* -----------------------------------------------------------
 * 4. IntersectionObserver로 무한 스크롤 실행
 * -----------------------------------------------------------*/
const observer = new IntersectionObserver(entries => {
  const target = entries[0];
  if (target.isIntersecting && !isLoading && !isLast) {
    loadPosts();
  }
});

observer.observe(loader);

// 첫 페이지 로드
window.addEventListener("DOMContentLoaded", loadPosts);
