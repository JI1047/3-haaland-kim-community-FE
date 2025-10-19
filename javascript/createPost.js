document.getElementById("title").addEventListener("input", (e) => {
  const title = e.target.value;
  validateEmail(title);
});

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
function validateEmail(title){
    const errorElement =document.getElementById("titleError");
   if(title.length > 26){
        errorElement.textContent = "제목은 최대 26자까지 작성 가능합니다."
        return false;
    }
    errorElement.textContent = ""
    return true;

}