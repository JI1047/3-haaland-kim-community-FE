import { jwtGuard } from "../common/jwt.js";
import { showToast } from "../common/toast.js";   // 🔥 추가

(async () => {
  try {
    await jwtGuard(); 
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
})();

/**
 * 비밀번호 입력 검증
 */
document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

/**
 * 비밀번호 확인 입력 검증
 */
document.getElementById("confirmPassword").addEventListener("input", (e) => {
  const confirmPassword = e.target.value;
  const password = document.getElementById("password").value;
  validateConfirmPassword(confirmPassword, password);
});

/**
 * 회원정보 수정 PUT 요청
 */
document.getElementById("updateButton").addEventListener("click", async () => {

  const newPassword = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const requestBody = {
    newPassword,
    confirmPassword
  };

  try {
    const response = await fetch(`${window.BACKEND_URL}/api/users/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      credentials: "include"
    });

    if (response.ok) {
      showToast("🔄 회원정보 수정 완료!", "success");   // 🔥 변경
      setTimeout(() => {
        location.href = "/getUser";
      }, 700);
    }

  } catch (error) {
    showToast("🚨 서버 요청 중 오류가 발생했습니다.", "error");  // 🔥 변경
  }
});

/**
 * 비밀번호 검증
 */
function validatePassword(password) {
  const errorElement = document.getElementById("passwordError");

  if (!password) {
    errorElement.textContent = "비밀번호를 입력해주세요.";
    return false;
  }
  if (password.length < 8 || password.length > 20) {
    errorElement.textContent = "비밀번호는 8자이상 20자이하여야 합니다.";
    return false;
  }

  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;
  const number = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?\":{}|<>]/;

  if (
    !upperCase.test(password) ||
    !lowerCase.test(password) ||
    !number.test(password) ||
    !specialChar.test(password)
  ) {
    errorElement.textContent =
      "비밀번호는 대문자,소문자,숫자,특수문자를 각각 최소 1개 포함해야합니다.";
    return false;
  }

  errorElement.textContent = "";
  return true;
}

/**
 * 비밀번호 확인 검증
 */
function validateConfirmPassword(confirmPassword, password) {
  const errorElement = document.getElementById("passwordError");

  if (!password) {
    errorElement.textContent = "먼저 비밀번호를 입력해주세요.";
    return false;
  }
  if (password != confirmPassword) {
    errorElement.textContent = "비밀번호가 일치하지 않습니다..";
    return false;
  }

  errorElement.textContent = "";
  return true;
}
