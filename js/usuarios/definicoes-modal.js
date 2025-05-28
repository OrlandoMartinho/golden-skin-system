const openModalInscricao = async () => {
    

    try {
        // Carregar o modal dinamicamente
        const response = await fetch("../../components/usuarios/definicoes-gerais.html");
        if (!response.ok) {
            throw new Error(`Erro ao carregar o modal: ${response.statusText}`);
        }
        const html = await response.text();
        
        // Inserir modal no container
        const container = document.getElementById("inscricao-modal-container");
        container.innerHTML = html;
        
        configurarModal(); // Inicializa os eventos do modal
    } catch (error) {
        console.error("Erro ao carregar o modal:", error);
    }
};

function configurarModal() {
    const modal = document.getElementById("inscricao-modalDialog");
    const fecharModal = document.getElementById("inscricao-closeModal");
    
    if (!modal) {
        console.error("Modal não encontrado!");
        return;
    }
    
    modal.showModal(); // Abre o modal automaticamente ao ser carregado
    
    if (fecharModal) {
        fecharModal.addEventListener("click", () => modal.close());
    }

    // Fechar modal ao clicar fora
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
}


const openModalSeguranca = async () => {
    

    try {
        // Carregar o modal dinamicamente
        const response = await fetch("../../components/usuarios/definicoes-seguranca.html");
        if (!response.ok) {
            throw new Error(`Erro ao carregar o modal: ${response.statusText}`);
        }
        const html = await response.text();
        
        // Inserir modal no container
        const container = document.getElementById("inscricao-modal-container");
        container.innerHTML = html;
        
        configurarModalS(); // Inicializa os eventos do modal
    } catch (error) {
        console.error("Erro ao carregar o modal:", error);
    }
};

function configurarModalS() {
    const modal = document.getElementById("seguranca-modalDialog");
    const fecharModal = document.getElementById("seguranca-closeModal");
    
    if (!modal) {
        console.error("Modal não encontrado!");
        return;
    }
    
    modal.showModal(); // Abre o modal automaticamente ao ser carregado
    
    if (fecharModal) {
        fecharModal.addEventListener("click", () => modal.close());
    }

    // Fechar modal ao clicar fora
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
}