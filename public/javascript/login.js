/**
 * 회원 가입시 이메일 입력 형식 검증 이벤트 리스너 
 * 이메일을 입력했는지, '@','.'를 포함했는지 검증하는 과정
 * 
 */
document.getElementById("email").addEventListener("input", (e) => {
  const email = e.target.value;
  validateEmail(email);
});


/**
 * 회원 가입시 비밀번호 입력 형식 검증
 * 비밀번호를 입력했는지, 비밀번호 길이 및 입력 형식 검증을 진행
 */
document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

/**
 * 로그인시 fetch 연결 메서드
 * 1. loginButton이 눌렸을 때 실행되는 fetch 요청
 * 2. email,password id를 통해서 찾고 변수에 저장
 * 3. requestBody 객체를 통해서 한번에 요청하기 위해 설정
 * 4. http://localhost:8080/api/users/login로 백엔드 POST요청을 보냄
 * 5. 로그인 후 서버가 발급한 세션 쿠키를 포함하기 위헤 credentials: "include"로 설정
 * 5. 응답이 성공적으로 왔을 경우 회원 정보 조회 페이지로 이동
 * 6. 응답 중 오류가 발생했을 시 오류발생 메세지 반환
 */
document.getElementById("loginButton").addEventListener("click", async() => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const requestBody = {
        email,
        password,

    }
    try{
      const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      credentials: "include" //쿠키 설정을 위해
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();

      if (response.ok) {
      location.href = "/getUser";
      } else {
      alert(`${responseData.message || "로그인 중 오류가 발생했습니다."}`);
    }
    }
    

  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});


//이메일 빛 비밀번호 검증 메서드는 회원가입과 동일
function validateEmail(email){
    const errorElement =document.getElementById("emailError");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email){
        errorElement.textContent = "이메일을 입력해주세요.";
        return false;
    }
    if(!emailPattern.test(email)){
        errorElement.textContent = "올바른 이메일 형식이 아닙니다."
        return false;
    }
    errorElement.textContent = ""
    return true;

}

function validatePassword(password){
    const errorElement =document.getElementById("passwordError");

    if(!password){
        errorElement.textContent = "비밀번호를 입력해주세요.";
        return false;
    }
    if(password.length < 8 || password.length > 20){
        errorElement.textContent = "비밀번호는 8자이상 20자이하여야 합니다."
        return false;
    }
    const upperCase = /[A-Z]/;       
    const lowerCase = /[a-z]/;       
    const number = /[0-9]/;          
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if(
        !upperCase.test(password) ||
        !lowerCase.test(password) ||
        !number.test(password) ||
        !specialChar.test(password) 
    ){
        errorElement.textContent = "비밀번호는 대문자,소문자,숫자,특수문자를 각각 최소 1개 포함해야합니다."
        return false;

    }
    
    errorElement.textContent = ""
    return true;

}
