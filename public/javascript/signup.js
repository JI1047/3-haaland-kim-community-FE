import { showToast } from "../common/toast.js";

const profileFileInput = document.getElementById("profileFile");
const previewImage = document.getElementById("previewImage");
let uploadedImageUrl = null;

/**
 * 이미지 클릭 시 파일 선택창 열기
 */
previewImage.addEventListener("click", () => profileFileInput.click());

/**
 * 파일 선택 후 Presigned URL을 통해 S3에 직접 업로드
 */
profileFileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  previewImage.src = URL.createObjectURL(file);

  try {
    const LAMBDA_UPLOAD_URL =
      "https://dkqpvtnd78.execute-api.ap-northeast-2.amazonaws.com/upload/profile-image";

    const formData = new FormData();
    formData.append("file", file);

    const lambdaRes = await fetch(LAMBDA_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!lambdaRes.ok) throw new Error("Lambda 업로드 실패");

    const lambdaJson = await lambdaRes.json();
    uploadedImageUrl = lambdaJson.data.filePath;

    document.cookie = `profileImageUrl=${uploadedImageUrl}; path=/; max-age=${60 * 30};`;

    showToast("📸 이미지 업로드 완료!", "success");
  } catch (error) {
    console.error("이미지 업로드 중 오류:", error);
    showToast("🚨 이미지 업로드 실패", "error");
  }
});

/**
 * 이메일 검증 리스너
 */
document.getElementById("email").addEventListener("input", (e) => {
  const email = e.target.value;
  validateEmail(email);
});

/**
 * 비밀번호 검증 리스너
 */
document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

/**
 * 비밀번호 확인 검증 리스너
 */
document.getElementById("confirmPassword").addEventListener("input", (e) => {
  const confirmPassword = e.target.value;
  const password = document.getElementById("password").value;
  validateConfirmPassword(confirmPassword, password);
});

/**
 * 닉네임 검증 리스너
 */
document.getElementById("nickname").addEventListener("input", (e) => {
  const nickname = e.target.value;
  validateNickname(nickname);
});

/**
 * 회원가입 요청
 */
document.getElementById("signupButton").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const nickname = document.getElementById("nickname").value;

  const cookies = Object.fromEntries(
    document.cookie.split("; ").map((v) => v.split("="))
  );
  const profileImageUrl = cookies["profileImageUrl"] || null;

  let termsAgreement = null;
  if (cookies.termsAgreement) {
    try {
      termsAgreement = JSON.parse(decodeURIComponent(cookies.termsAgreement));
      if (termsAgreement.agreeTime) {
        termsAgreement.agreeTime = termsAgreement.agreeTime.replace("Z", "");
      }
    } catch (e) {
      console.warn("termsAgreement 파싱 오류:", e);
    }
  }

  const requestBody = {
    email,
    password,
    confirmPassword,
    nickname,
    profileImage: profileImageUrl,
    termsAgreement,
  };

  try {
    const res = await fetch(`${window.BACKEND_URL}/api/users/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const err = await res.json();

      // 🔥 Validation 오류(errors[])
      if (err.errors && Array.isArray(err.errors)) {

        // 🔥 1) 필드 우선순위 정의
        const priority = ["email", "password", "confirmPassword", "nickname"];

        // 🔥 2) errors[]를 우선순위 기준으로 정렬
        const sortedErrors = [...err.errors].sort(
          (a, b) => priority.indexOf(a.field) - priority.indexOf(b.field)
        );

        // 🔥 3) 최상단 Error(우선순위 가장 높은 필드)의 메시지를 toast로 표시
        const topErrorMessage = sortedErrors[0]?.message || err.message;
        showToast(topErrorMessage, "error");

        // 🔥 4) 모든 에러를 해당 input 밑에 표시
        sortedErrors.forEach((e) => {
          const target = document.getElementById(`${e.field}Error`);
          if (target) {
            target.textContent = e.message;
          }
        });

        return;
      }

      // 🔥 비즈니스 예외 (BusinessException)
      showToast(err.message || "회원가입 실패", "error");
      return;
    }



    showToast("🎉 회원가입 성공!", "success");

    document.cookie = "profileImageKey=; Max-Age=0; path=/;";
    document.cookie = "termsAgreement=; Max-Age=0; path=/;";

    setTimeout(() => {
      location.href = "/login";
    }, 700);

  } catch (error) {
    console.error("회원가입 요청 중 오류:", error);
    showToast("🚨 서버 요청 오류가 발생했습니다.", "error");
  }
});

/* ------------------- 검증 함수 (변경 없음) ------------------- */

function validateEmail(email) {
  const errorElement = document.getElementById("emailError");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errorElement.textContent = "이메일을 입력해주세요.";
    return false;
  }
  if (!emailPattern.test(email)) {
    errorElement.textContent = "올바른 이메일 형식이 아닙니다.";
    return false;
  }

  errorElement.textContent = "";
  return true;
}

function validatePassword(password) {
  const errorElement = document.getElementById("passwordError");

  if (!password) {
    errorElement.textContent = "비밀번호를 입력해주세요.";
    return false;
  }
  if (password.length < 8 || password.length > 20) {
    errorElement.textContent = "비밀번호는 8자 이상 20자 이하이어야 합니다.";
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
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  }

  errorElement.textContent = "";
  return true;
}

function validateNickname(nickname) {
  const errorElement = document.getElementById("nicknameError");

  if (!nickname) {
    errorElement.textContent = "닉네임을 입력해주세요.";
    return false;
  }
  if (nickname.length > 10) {
    errorElement.textContent = "닉네임은 최대 10자까지 작성 가능합니다.";
    return false;
  }
  if (nickname.includes(" ")) {
    errorElement.textContent = "띄어쓰기를 없애주세요.";
    return false;
  }

  errorElement.textContent = "";
  return true;
}

function validateConfirmPassword(confirmPassword, password) {
  const errorElement = document.getElementById("confirmPasswordError");

  if (!password) {
    errorElement.textContent = "먼저 비밀번호를 입력해주세요.";
    return false;
  }
  if (password !== confirmPassword) {
    errorElement.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  }

  errorElement.textContent = "";
  return true;
}
