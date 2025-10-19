/**
 * 게시물 생성시 제목 입력 형식 검증 이벤트 리스너 
 *  제목 길이 검증
 * 
 * 1. html에서 title 설정된 id를 찾는다.
 * 2. 사용자가 입력한 title 추출하여 변수에 저장한다.
 * 3. validateTitle함수 메서드를 호출하여 제목 검증을 진행한다.
 */
document.getElementById("title").addEventListener("input", (e) => {
  const title = e.target.value;
  validateTitle(title);
});

/**
 * 게시물 생성시 fetch 연결 요청
 * 1. title,text를 id를 통해서 찾고 변수에 저장
 * 1-1. profileImage는 아직 백엔드 이미지 처리로직이 미완성 돼잇기 때문에 임의의 url로 설정
 * 2. requestBody 객체를 통해서 한번에 요청하기 위해 설정
 * 3. http://127.0.0.1:8080/api/posts/create로 백엔드 POST요청을 보냄
 * 4. 응답이 성공적으로 왔을 경우 게시물 생성 성공 메세지를 반환 후 게시물 리스트 목록 페이지(임시 페이지)로 이동
 * 5. 응답 중 오류가 발생했을 시 오류발생 메세지 반환
 */
document.getElementById("createPostButton").addEventListener("click", async() => {

    const title = document.getElementById("title").value;
    const text = document.getElementById("text").value;
    const profileImage = "www.s3.url"

    const requestBody = {
        
        title,
        text,
        profileImage

    }
    try{
      const response = await fetch("http://127.0.0.1:8080/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      credentials : "include"
    });

    if (response.ok) {
      alert("게시물 생성 성공!");
      location.href = "/html/getPostList.html";

    } 
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});

//제목의 길이를 검증하는 메서드
function validateTitle(title){
    const errorElement =document.getElementById("titleError");
   if(title.length > 26){
        errorElement.textContent = "제목은 최대 26자까지 작성 가능합니다."
        return false;
    }
    errorElement.textContent = ""
    return true;

}