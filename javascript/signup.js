document.getElementById("email").addEventListener("input", (e) => {
  const email = e.target.value;
  validateEmail(email);
});


document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

document.getElementById("confirmPassword").addEventListener("input", (e) => {
  const confirmPassword = e.target.value;

  const password = document.getElementById("password").value;
  validateConfirmPassword(confirmPassword,password);
});


document.getElementById("nickname").addEventListener("input", (e) => {
  const nickname = e.target.value;
  validateNickname(nickname);
});

document.getElementById("signupButton").addEventListener("click", async() => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const nickname = document.getElementById("nickname").value;
    const profileImage = "www.s3.url"

    const requestBody = {
        email,
        password,
        confirmPassword,
        nickname,
        profileImage
    }
    try{
      const response = await fetch("http://localhost:8080/api/users/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      alert("회원가입 성공!");
    } 
  } catch (error) {
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});



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

