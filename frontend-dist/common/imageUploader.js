export function setupImageUploader({ 
  previewSelector, 
  inputSelector, 
  onUploaded 
}) {

  const inputEl = document.querySelector(inputSelector);
  const previewEl = document.querySelector(previewSelector);
  let uploadedImageUrl = null;

  if (!inputEl || !previewEl) {
    console.error("Image uploader: selector mismatch");
    return;
  }

  // 미리보기 클릭 → 파일 선택창
  previewEl.addEventListener("click", () => inputEl.click());

  // 파일 변경 이벤트
  inputEl.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 미리보기 표시
    previewEl.src = URL.createObjectURL(file);

    try {
      const LAMBDA_UPLOAD_URL =
        "https://dkqpvtnd78.execute-api.ap-northeast-2.amazonaws.com/upload/profile-image";

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(LAMBDA_UPLOAD_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error("Lambda 업로드 실패");

      const json = await res.json();
      uploadedImageUrl = json.data.filePath;

      // callback 실행
      onUploaded && onUploaded(uploadedImageUrl);

    } catch (err) {
      console.error("이미지 업로드 오류", err);
      alert("이미지 업로드 실패");
    }
  });
}
