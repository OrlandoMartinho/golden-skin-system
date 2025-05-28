document.getElementById("entrar").addEventListener("click", function (event) {
    event.preventDefault(); // Impede o comportamento padrão do botão

    // Capturar valores do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Simulação de autenticação (Substitua por uma requisição real à API)
  if(email.includes("admin")){
        window.location.href = "../../pages/admin/admin-home.html";
    }else{
        window.location.href = "../../pages/usuarios/user-home.html";
    }
});