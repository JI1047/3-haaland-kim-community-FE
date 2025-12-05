import { setupImageUploader } from "/common/imageUploader.js";

/* -----------------------------------------------------------
 * 0. DOMContentLoaded 진입점
 * -----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
  try {

    document.getElementById("previewImage").addEventListener("click", () => {
    document.getElementById("profileFile").click();
    });

    initImageUpload(); 
    initTitleValidation();
    initCreateButton();
  } catch (e) {
    console.warn("인증 실패:", e.message);
  }
});


/* -----------------------------------------------------------
 * 1. 공통 이미지 업로더 적용
 *    - previewImage 클릭 → 파일 선택
 *    - S3 업로드 후 profileImageUrl 쿠키에 저장
 * -----------------------------------------------------------*/
function initImageUpload() {
  setupImageUploader({
    previewSelector: "#previewImage",  // 미리보기 <img>
    inputSelector: "#profileFile",     // 숨겨진/실제 file input
    cookieKey: "profileImageUrl",      // 쿠키에 저장할 키
    onUploaded: (url) => {
      // 필요하면 추가 로직을 여기서 처리 가능
      console.log("프로필 이미지 업로드 완료:", url);
      // cookieKey 옵션이 이미 쿠키를 관리한다면 이 줄은 생략 가능
      document.cookie = `profileImageUrl=${url}; path=/; max-age=${60 * 30}`;
    }
  });
}

/* -----------------------------------------------------------
 * 2. 입력 검증 이벤트 등록
 * -----------------------------------------------------------*/
function initValidationEvents() {
  document.getElementById("email").addEventListener("input", (e) => {
    validateEmail(e.target.value);
  });

  document.getElementById("password").addEventListener("input", (e) => {
    validatePassword(e.target.value);
  });

  document.getElementById("confirmPassword").addEventListener("input", (e) => {
    const confirmPassword = e.target.value;
    const password = document.getElementById("password").value;
    validateConfirmPassword(confirmPassword, password);
  });

  document.getElementById("nickname").addEventListener("input", (e) => {
    validateNickname(e.target.value);
  });
}

/* -----------------------------------------------------------
 * 3. 회원가입 버튼 클릭 → fetch 요청
 * -----------------------------------------------------------*/
function initSignupButton() {
  document.getElementById("signupButton").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const nickname = document.getElementById("nickname").value;

    // S3에서 업로드된 프로필 이미지 경로 쿠키에서 불러오기
    const cookies = Object.fromEntries(document.cookie.split("; ").map(v => v.split("=")));
    const profileImageUrl = cookies["profileImageUrl"] || null;

    // 약관 동의 정보 쿠키에서 불러오기
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
        alert(err.message || "회원가입 실패");
        return;
      }

      alert("회원가입 성공!");

      // ✅ 실제로 쓰던 쿠키 키랑 맞춰서 삭제
      document.cookie = "profileImageUrl=; Max-Age=0; path=/;";
      document.cookie = "termsAgreement=; Max-Age=0; path=/;";

      location.href = "/login";

    } catch (error) {
      console.error("회원가입 요청 중 오류:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    }
  });
}

/* -----------------------------------------------------------
 * 4. 검증 함수들
 * -----------------------------------------------------------*/
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
    errorElement.textContent = "비밀번호는 8자이상 20자이하여야 합니다.";
    return false;
  }
  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;
  const number = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

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
    errorElement.textContent = "띄어쓰기를 없애주세요";
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
