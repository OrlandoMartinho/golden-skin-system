document.getElementById("cadastrar").addEventListener("click", async function (event) {
    event.preventDefault(); // Impede o comportamento padrão do botão
    alert("Cadastro iniciado!"); // Exibe alerta de início do cadastro
    const btnCadastrar = this; // Referência ao botão
    const btnOriginalText = btnCadastrar.innerHTML; // Salva o texto original
    
    try {
        // Ativa o estado de loading
        btnCadastrar.innerHTML = `
            <span class="loader"></span>
            <span>Processando...</span>
        `;
        btnCadastrar.disabled = true;

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        // Validações
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        
        const validEmail = emailRegex.test(email);
        const validPassword = passwordRegex.test(senha);
        const passwordsMatch = senha === confirmarSenha;

        if (!validEmail) {
            showMessageModal('error', 'Erro!', 'Por favor, insira um email válido.', {
                buttonText: 'Entendido'
            });
            return;
        }

        if (!validPassword) {
            showMessageModal('error', 'Erro!', 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.', {
                buttonText: 'Entendido'
            });
            return;
        }

        if (!passwordsMatch) {
            showMessageModal('error', 'Erro!', 'As senhas não coincidem.', {
                buttonText: 'Entendido'
            });
            return;
        }

        // Simulação de cadastro
        localStorage.setItem('RegisterData', JSON.stringify({
            nome: nome,
            email: email,
            senha: senha
        }));
        
        const status = await receiveCode(email);

        if (status === 200) {
            window.location.href = 'codigo_de_confirmacao.html';
        } else if (status === 409) {
            showMessageModal('error', 'Erro!', 'Este email já está cadastrado.', {
                buttonText: 'Entendido'
            });
        } else {
            showMessageModal('error', 'Erro', 'Ocorreu um problema ao cadastrar.', { 
                buttonText: 'Tentar novamente' 
            });
        }
    } catch (error) {
        console.error("Erro no cadastro:", error);
        showMessageModal('error', 'Erro', 'Ocorreu um problema inesperado.', {
            buttonText: 'Tentar novamente'
        });
    } finally {
        // Restaura o botão ao estado original
        btnCadastrar.innerHTML = btnOriginalText;
        btnCadastrar.disabled = false;
    }
});