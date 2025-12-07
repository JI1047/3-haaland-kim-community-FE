import { showToast } from "../common/toast.js";

const postList = document.getElementById("postList");
const loader = document.getElementById("loader");

// 페이지 로드시 로그인 여부 체크
document.addEventListener("DOMContentLoaded", () => {
  checkLoginState();
});

let page = 0;
let size = 5;
let isLoading = false;
let isLast = false;

/* -----------------------------------------------------------
 * 1. 로그인 상태에 따라 "게시글 작성" 버튼 표시/숨김
 * -----------------------------------------------------------*/
async function checkLoginState() {
  const btn = document.querySelector(".write-btn");

  try {
    const res = await fetch("/api/jwt/validate", {
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

    const dateText = new Date(post.createdAt).toLocaleString();
    const excerpt = buildExcerpt(post.text);
    const like = post.likeCount ?? 0;
    const comment = post.commentCount ?? 0;
    const view = post.lookCount ?? 0;

    div.innerHTML = `
      <div class="post-top">
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${excerpt}</p>
      </div>
      <div class="post-footer">
        <div class="post-author">
          <span>${post.nickname}</span>
          <span class="meta-dot"></span>
          <span>${dateText}</span>
        </div>
        <div class="post-stats">
          <span class="stat">❤️ ${like}</span>
          <span class="stat">💬 ${comment}</span>
          <span class="stat">👀 ${view}</span>
        </div>
      </div>
    `;
    div.addEventListener("click", () => {
      window.location.href = `/getPost?id=${post.postId}`;
    });
    postList.appendChild(div);
  });
}

function buildExcerpt(text) {
  if (!text) return "내용 미리보기가 없습니다.";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 60 ? `${clean.slice(0, 60)}…` : clean;
}

/* -----------------------------------------------------------
 * 3. 게시글 불러오기 (무한 스크롤)
 * -----------------------------------------------------------*/
async function loadPosts() {
  if (isLoading || isLast) return;
  isLoading = true;
  loader.style.display = "block";

  try {
    const res = await fetch(`${window.BACKEND_URL}/api/posts/list?page=${page}&size=${size}`);
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
