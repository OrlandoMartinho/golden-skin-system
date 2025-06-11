document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.code-inputs input');
    const recoveryForm = document.getElementById('recoveryForm');
    const confirmarBtn = document.getElementById('confirmarBtn');
    
    // Configuração dos inputs de código
    inputs.forEach((input, index) => {
        // Garante que apenas números sejam aceitos
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
            if (this.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            
            // Garante que o valor não ultrapasse 1 dígito
            if (this.value.length > 1) {
                this.value = this.value.slice(0, 1);
            }
        });
        
        // Permite navegar entre os inputs
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
    
    // Submissão do formulário
    recoveryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnOriginalText = confirmarBtn.innerHTML;
        
        try {
            // Ativa o estado de loading
            confirmarBtn.innerHTML = `
                <span class="loader"></span>
                <span>Verificando...</span>
            `;
            confirmarBtn.disabled = true;
            
            // Obtém o código completo
            const codigo = Array.from(inputs).map(input => input.value).join('');
            
            // Validação básica
            if (codigo.length !== 4) {
                showMessageModal('error', 'Erro!', 'Por favor, preencha todos os dígitos do código.', {
                    buttonText: 'Entendido'
                });
                return;
            }
            
            // Simulação de chamada à API
            const userData = JSON.parse(localStorage.getItem('RegisterData'));
            if (!userData) {
                showMessageModal('error', 'Erro!', 'Dados de registro não encontrados. Por favor, registre-se novamente.', {
                    buttonText: 'Entendido'
                });
                window.location.href = 'cadastro.html';
                return;    
            } 
            userData.codigo = codigo; // Adiciona o código ao objeto de dados
            const status = await registerUserNormal(userData);
                               
            if (status === 200) {
                showMessageModal('success', 'Sucesso!', 'Código validado com sucesso!', {
                    buttonText: 'Continuar',
                    onClose: () => {
                        window.location.href = 'nova_senha.html';
                    }
                });
            } else if (status === 400) {
                showMessageModal('error', 'Erro!', 'Código inválido. Por favor, tente novamente.', {
                    buttonText: 'Entendido'
                });
                // Limpa os campos após erro
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            } else if (status === 410) {
                showMessageModal('error', 'Erro!', 'Código expirado. Solicite um novo código.', {
                    buttonText: 'Entendido'
                });
                // Limpa os campos após erro
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            } else {
                showMessageModal('error', 'Erro', 'Ocorreu um problema ao verificar o código.', { 
                    buttonText: 'Tentar novamente'
                });
                // Limpa os campos após erro
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            }
        } catch (error) {
            console.error("Erro na verificação:", error);
            showMessageModal('error', 'Erro', 'Ocorreu um problema inesperado.', {
                buttonText: 'Tentar novamente'
            });
            // Limpa os campos após erro
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        } finally {
            // Restaura o botão ao estado original
            confirmarBtn.innerHTML = btnOriginalText;
            confirmarBtn.disabled = false;
        }
    });
});