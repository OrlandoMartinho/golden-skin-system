


document.getElementById("logout").addEventListener("click", () => {

  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("idUser");
  window.location.href = "../../pages/sessoes/login.html";
});
