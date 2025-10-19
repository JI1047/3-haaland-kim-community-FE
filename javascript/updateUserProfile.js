/**
 * 회원정보 수정 시 닉네임 입력 형식 검증 메서드
 * 닉네임을 입력했는지, 닉네임 길이 검증, 닉네임 띄어쓰기 포함 검증을 진행한다.
 */
document.getElementById("nickname").addEventListener("input", (e) => {
  const nickname = e.target.value;
  validateNickname(nickname);
});

/**
 * 회원정보 수정 시 fetch 연결 메서드
 * 1. updateButton 눌렸을 때 실행되는 fetch 요청
 * 2. nickname을 id를 통해서 찾고 변수에 저장
 * 2-1. profileImage는 임의의 url로 설정
 * 3. requestBody 객체를 통해서 한번에 요청하기 위해 설정
 * 4. http://127.0.0.1:8080/api/users/profile로 백엔드 PUT요청을 보냄
 * 5. 백엔드 cors에서 세션 인증이 필요한 요청으로 설정했기 때문에 credentials: "include"로 설정
 * 5. 응답이 성공적으로 왔을 경우 회원 정보 조회 페이지로 이동
 * 6. 응답 중 오류가 발생했을 시 오류발생 메세지 반환
 */
document.getElementById("updateButton").addEventListener("click", async() => {

    const nickname = document.getElementById("nickname").value;
    const profileImage = "www.s3.url"

    const requestBody = {
        
        nickname,
        profileImage
    }
    try{
      const response = await fetch("http://127.0.0.1:8080/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      credentials : "include"
    });

    if (response.ok) {
      alert("회원수정 성공!");
      location.href = "/html/getUser.html";

    } 
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});

//회원정보 수정 메서드는 회원가입과 동일
function validateNickname(nickname){
    const errorElement =document.getElementById("nicknameError");

    if(!nickname){
        errorElement.textContent = "닉네임을 입력해주세요.";
        return false;
    }
    if(nickname.length > 10){
        errorElement.textContent = "닉네임은 최대 10자까지 작성 가능합니다."
        return false;
    }
    if(nickname.includes(" ")){
        errorElement.textContent = "띄어쓰기를 없애주세요"
        return false;
    }
    
    errorElement.textContent = ""
    return true;

}