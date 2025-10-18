document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

document.getElementById("confirmPassword").addEventListener("input", (e) => {
  const confirmPassword = e.target.value;

  const password = document.getElementById("password").value;
  validateConfirmPassword(confirmPassword,password);
});

document.getElementById("updateButton").addEventListener("click", async() => {

    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;



    const requestBody = {
        
        newPassword,
        confirmPassword
    }
    try{
      const response = await fetch("http://127.0.0.1:8080/api/users/password", {
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