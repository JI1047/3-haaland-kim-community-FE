/**
 * 회원 가입시 비밀번호 입력 형식 검증
 * 비밀번호를 입력했는지, 비밀번호 길이 및 입력 형식 검증을 진행\
 */
document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

/**
 * 회원 가입시 비밀번호 확인 입력 형식 검증 메서드
 * 먼저 입력한 비밀번호와 일치한지, 확인하는 과정
 * 먼저 입력한 비밀번호에서 입력 검증을 진행하였기 때문에 다시 진행하지 않고 일치 여부만 확인
 */
document.getElementById("confirmPassword").addEventListener("input", (e) => {
  const confirmPassword = e.target.value;

  const password = document.getElementById("password").value;
  validateConfirmPassword(confirmPassword,password);
});

/**
 * 회원정보 수정 시 fetch 연결 메서드
 * 1. updateButton 눌렸을 때 실행되는 fetch 요청
 * 2. newPassword,confirmPassword id를 통해서 찾고 변수에 저장
 * 3. requestBody 객체를 통해서 한번에 요청하기 위해 설정
 * 4. http://127.0.0.1:8080/api/users/password로 백엔드 PUT요청을 보냄
 * 5. 백엔드 cors에서 세션 인증이 필요한 요청으로 설정했기 때문에 credentials: "include"로 설정
 * 5. 응답이 성공적으로 왔을 경우 회원 정보 조회 페이지로 이동
 * 6. 응답 중 오류가 발생했을 시 오류발생 메세지 반환
 */
document.getElementById("updateButton").addEventListener("click", async() => {

    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const requestBody = {
        newPassword,
        confirmPassword
    }
    try{
      const response = await fetch("http://localhost:8080/api/users/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      credentials : "include"
    });

    if (response.ok) {
      alert("회원수정 성공!");
      location.href = "/getUser";

    } 
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});


//비밀번호와 비밀번호 확인 입력 검증은 회원가입과 동일
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
function validateConfirmPassword(confirmPassword,password){
    const errorElement =document.getElementById("passwordError");

    if(!password){
        errorElement.textContent = "먼저 비밀번호를 입력해주세요.";
        return false;
    }
    if(password != confirmPassword){
        errorElement.textContent = "비밀번호가 일치하지 않습니다.."
        return false;
    }
    
    
    errorElement.textContent = ""
    return true;

}