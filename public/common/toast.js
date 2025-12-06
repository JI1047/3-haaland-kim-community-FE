export function showToast(message, type = "error") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");

  toast.classList.add("toast");

  // 타입별 색상 적용
  if (type === "success") {
    toast.classList.add("toast-success");
  } else if (type === "warning") {
    toast.classList.add("toast-warning");
  } else {
    toast.classList.add("toast-error");
  }

  toast.textContent = message;

  container.appendChild(toast);

  // 3초 후 제거
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
