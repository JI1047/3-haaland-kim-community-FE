document.getElementById("nickname").addEventListener("input", (e) => {
  const nickname = e.target.value;
  validateNickname(nickname);
});

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