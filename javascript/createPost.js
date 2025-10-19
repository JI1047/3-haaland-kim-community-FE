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