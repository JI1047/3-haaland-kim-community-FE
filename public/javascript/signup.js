/**
 * 회원 가입시 이메일 입력 형식 검증 이벤트 리스너 
 * 이메일을 입력했는지, '@','.'를 포함했는지 검증하는 과정
 * 
 * 1. html에서 email로 설정된 id를 찾는다.
 * 2. 사용자가 입력한 email을 추출하여 변수에 저장한다.
 * 3. validateEmail함수 메서드를 호출하여 이메일 검증을 진행한다.
 */
document.getElementById("email").addEventListener("input", (e) => {
  const email = e.target.value;
  validateEmail(email);
});


/**
 * 회원 가입시 비밀번호 입력 형식 검증
 * 비밀번호를 입력했는지, 비밀번호 길이 및 입력 형식 검증을 진행
 * 
 * 1. html에서 password로 설정된 id를 찾는다.
 * 2. 사용자가 입력한 password를 추출하여 변수에 저장한다.
 * 3. validatePassword함수 메서드를 호출하여 비밀번호 검증을 진행한다.
 */
document.getElementById("password").addEventListener("input", (e) => {
  const password = e.target.value;
  validatePassword(password);
});

/**
 * 회원 가입시 비밀번호 확인 입력 형식 검증 메서드
 * 먼저 입력한 비밀번호와 일치한지, 확인하는 과정
 * 먼저 입력한 비밀번호에서 입력 검증을 진행하였기 때문에 다시 진행하지 않고 일치 여부만 확인
 * 
 * 1. html에서 confirmPassword로 설정된 id를 찾는다.
 * 2. 사용자가 입력한 confirmPassword를 추출하여 변수에 저장한다.
 * 3. html에서 password로 설정된 id를 찾고 value를 password변수에 저장한다.
 * 4. validatePassword함수 메서드에 confirmPassword,password를 포함해 비밀번호 확인 검증을 진행한다.
 */
document.getElementById("confirmPassword").addEventListener("input", (e) => {
  const confirmPassword = e.target.value;

  const password = document.getElementById("password").value;
  validateConfirmPassword(confirmPassword,password);
});


/**
 * 회원 가입시 닉네임 입력 형식 검증 메서드
 * 닉네임을 입력했는지, 닉네임 길이 검증, 닉네임 띄어쓰기 포함 검증을 진행한다.
 * 
 * 1. html에서 nickname 설정된 id를 찾는다.
 * 2. 사용자가 입력한 nickname 추출하여 변수에 저장한다.
 * 3. validateNickname함수 메서드를 호출하여 닉네임 검증을 진행한다.
 */
document.getElementById("nickname").addEventListener("input", (e) => {
  const nickname = e.target.value;
  validateNickname(nickname);
});

/**
 * 회원 가입시 fetch 연결 메서드
 * 1. email,password,confirmPassword,nickname를 id를 통해서 찾고 변수에 저장
 * 1-1. profileImage는 아직 백엔드 이미지 처리로직이 미완성 돼잇기 때문에 임의의 url로 설정
 * 2. requestBody 객체를 통해서 한번에 요청하기 위해 설정
 * 3. http://localhost:8080/api/users/sign-up로 백엔드 POST요청을 보냄
 * 4. 응답이 성공적으로 왔을 경우 회원가입 성공 메세지를 반환
 * 5. 응답 중 오류가 발생했을 시 오류발생 메세지 반환
 */
document.getElementById("signupButton").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const nickname = document.getElementById("nickname").value;
  const profileImage = "www.s3.url";

  const cookies = document.cookie.split("; ").reduce((acc, current) => {
  const [key, value] = current.split("=");
    acc[key] = value;
    return acc;
  }, {});

  let termsAgreement = null;
  if (cookies.termsAgreement) {
    termsAgreement = JSON.parse(decodeURIComponent(cookies.termsAgreement));
    // LocalDateTime 파싱 호환용으로 "Z" 제거
    if (termsAgreement.agreeTime) {
      termsAgreement.agreeTime = termsAgreement.agreeTime.replace("Z", "");
    }
  }
  const requestBody = {
    email,
    password,
    confirmPassword,
    nickname,
    profileImage,
    termsAgreement
  };


  try {
    const response = await fetch("http://localhost:8080/api/users/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });



    const contentType = response.headers.get("content-type");

    //  JSON 형태인지 아닌지 먼저 확인
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();

      if (response.ok) {
        alert("회원가입 성공!");
        location.href = "/login";
      } else {
        alert(responseData.message || "회원가입 중 오류가 발생했습니다.");
      }
    } 
  } catch (error) {
    console.error(" 네트워크 오류 발생:", error);
    alert("서버 요청 중 오류가 발생했습니다.");
  }
});


/**
 * 회원 가입시 이메일 입력 형식 검증 메서드
 * 이메일을 입력했는지, '@','.'를 포함했는지 검증하는 과정
 * 
 * 1. html에서 emailError로 설정된 id를 찾고 변수에 저장
 * 1-1. 에러메세지를 반환하기 위한 변수 생성(errorElement)
 * 2. 이메일 검증(입력/형식)
 * 2-1. 검증 모두 성공 시 빈 문자열로 저장되고 true를 return하여 문제가 없음을 알림
 * 2-2. 검증 중 조건에 어긋날 경우 에러메세지 변수에 원인을 포함하여 false를 리턴
 */
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

/**
 * 회원 가입시 비밀번호 입력 형식 검증 메서드
 * 
 * 1. html에서 passwordError로 설정된 id를 찾고 변수에 저장
 * 1-1. 에러메세지를 반환하기 위한 변수 생성(errorElement)
 * 2. 비밀번호 검증(입력/길이/형식)
 * 2-1. 검증 모두 성공 시 빈 문자열로 저장되고 true를 return하여 문제가 없음을 알림
 * 2-2. 검증 중 조건에 어긋날 경우 에러메세지 변수에 원인을 포함하여 false를 리턴
 */
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

/**
 * 회원 가입시 닉네임 입력 형식 검증 메서드
 * 
 * 1. html에서 nicknameError로 설정된 id를 찾고 변수에 저장
 * 1-1. 에러메세지를 반환하기 위한 변수 생성(errorElement)
 * 2. 닉네임 검증(입력/길이/형식)
 * 2-1. 검증 모두 성공 시 빈 문자열로 저장되고 true를 return하여 문제가 없음을 알림
 * 2-2. 검증 중 조건에 어긋날 경우 에러메세지 변수에 원인을 포함하여 false를 리턴
 */
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
/**
 * 회원 가입시 비밀번호 확인 입력 형식 검증 메서드
 * 
 * 1. html에서 confirmPasswordError 설정된 id를 찾고 변수에 저장
 * 1-1. 에러메세지를 반환하기 위한 변수 생성(errorElement)
 * 2. 비밀번호 확인 검증(비밀번호와 일치여부)
 * 2-1. 검증 모두 성공 시 빈 문자열로 저장되고 true를 return하여 문제가 없음을 알림
 * 2-2. 검증 중 조건에 어긋날 경우 에러메세지 변수에 원인을 포함하여 false를 리턴
 */
function validateConfirmPassword(confirmPassword,password){
    const errorElement =document.getElementById("confirmPasswordError");

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

