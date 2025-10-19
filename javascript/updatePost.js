//게시물 id를 관리하기위해 전역 변수로 생성
let postId;

/**
 * 게시물 수정 페이지 진입 시 기존 게시물 정보를 불러오는 fetch 요청
 * 1. 페이지 로드 시 실행되는 fetch 요청
 * 2. URL의 쿼리 파라미터(id)를 추출하여 postId 변수에 저장
 * 3. http://127.0.0.1:8080/api/posts/${postId}로 백엔드 GET 요청을 보냄
 * 4. 세션 쿠키를 포함하기 위해 credentials: "include"로 설정
 * 5. 서버로부터 받은 게시물 정보를 HTML 입력 요소(id=title, id=text)에 표시
 * 6. 요청 실패 시 콘솔 또는 경고창을 통해 오류 메시지를 표시
 */
document.addEventListener("DOMContentLoaded", async () => {
    
    const urlParam = new URLSearchParams(window.location.search);
    postId = urlParam.get("id");

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
    document.getElementById("title").value = data.title;
    document.getElementById("text").value = data.text;

  } catch (error) {
    console.error("에러:", error);
  }
});

//제목 검증 메서드
document.getElementById("title").addEventListener("input", (e) => {
  const title = e.target.value;
  validateTitle(title);
});

function validateTitle(title){
    const errorElement =document.getElementById("titleError");
   if(title.length > 26){
        errorElement.textContent = "제목은 최대 26자까지 작성 가능합니다."
        return false;
    }
    errorElement.textContent = ""
    return true;

}

/**
 * 게시물 수정 시 fetch 요청
 * 1. updateButton 클릭 시 실행되는 fetch 요청
 * 2. id=title, id=text 요소의 값을 변수에 저장
 * 3. profileImage는 임시 URL로 설정
 * 4. requestBody 객체를 구성하여 요청 본문에 포함
 * 5. http://127.0.0.1:8080/api/posts/${postId}/update로 백엔드 PUT 요청을 보냄
 * 6. 세션 기반 인증 요청이므로 credentials: "include"로 설정
 * 7. 요청 성공 시 '게시글 수정 성공' 메시지를 표시하고 게시물 상세 페이지로 이동
 * 8. 요청 실패 시 오류 메시지를 경고창으로 표시
 */
document.getElementById("updateButton").addEventListener("click", async() => {

    const title = document.getElementById("title").value;
    const text = document.getElementById("text").value;    
    const profileImage = "www.s3.url"

    const requestBody = {
        
        title,
        text,
        profileImage
    }
    try{
      const response = await fetch(`http://127.0.0.1:8080/api/posts/${postId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      credentials : "include"
    });

    if (response.ok) {
      alert("게시글 수정 성공!");
      location.href = `/html/getPost.html?id=${postId}`;

    } 
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});