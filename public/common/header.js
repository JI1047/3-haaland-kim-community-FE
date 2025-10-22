window.addEventListener("DOMContentLoaded", async () => {
  
  const isLogin = checkSessionCookie();

  document.getElementById("user-info").hidden = !isLogin;
  document.getElementById("update-profile").hidden = !isLogin;
  document.getElementById("logout").hidden = !isLogin;
  document.getElementById("login").hidden = isLogin;
  document.getElementById("signup").hidden = isLogin;
  
});

function checkSessionCookie() {
    return document.cookie.includes("sessionID=");
}
