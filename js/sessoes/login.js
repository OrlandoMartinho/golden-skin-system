

document.getElementById("entrar").addEventListener("click", async function (event) {
  event.preventDefault(); // Impede o comportamento padrão do botão

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;



const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    const validEmail = emailRegex.test(email)
    // const validPassword =passwordRegex.test(senha)
    if (!validEmail) {
       showMessageModal('error', 'Erro!', 'Por favor, insira um email válido.', {
        buttonText: 'Entendido'
       });
    }

    // if (!validPassword) {

    //     showMessageModal('error', 'Erro!', 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.', {
    //     buttonText: 'Entendido'
    //    });

    // }

    if(validEmail){
        
  const status = await authenticate(email, senha);


  if (status === 200) {
    showMessageModal('success', 'Sucesso!', 'Operação concluída com êxito.', {
      buttonText: 'Ótimo!'
    });

    const userRole = localStorage.getItem("userRole")

    if (userRole == 0) {
        window.location.href = "../../pages/admin/admin-home.html";
    } else {
        window.location.href = "../../pages/usuarios/user-home.html";
    }


  } else if (status === 404) {
    showMessageModal('error', 'Erro!', 'Usuário não cadastrado. Por favor, crie uma conta.', {
      buttonText: 'Entendido'
    });
  } else {
   window.showMessageModal('error', 'Erro', 'Ocorreu um problema.', { buttonText: 'Tentar novamente' });
  }
    }


});
