let postId;

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


document.getElementById("title").addEventListener("input", (e) => {
  const title = e.target.value;
  validateEmail(title);
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