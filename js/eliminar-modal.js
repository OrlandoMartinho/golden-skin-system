document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("eliminar-modal-container");

    async function showConfirmModal(title, message, onConfirm) {
        try {
            // Carregar o modal dinamicamente
            const response = await fetch("../../components/modal-eliminar.html");
            if (!response.ok) {
                throw new Error(`Erro ao carregar o modal: ${response.statusText}`);
            }
            const html = await response.text();
            
            // Inserir modal no container
            container.innerHTML = html;

            // Espera um curto período para o modal ser inserido no DOM
            setTimeout(() => configurarModalEliminar(title, message, onConfirm), 100);
        } catch (error) {
            console.error("Erro ao carregar o modal:", error);
        }
    }

    function configurarModalEliminar(title, message, onConfirm) {
        const modal = document.getElementById("confirm-modal");
        const titleElement = document.getElementById("confirm-title");
        const messageElement = document.getElementById("confirm-message");
        const cancelButton = document.getElementById("confirm-cancel");
        const confirmButton = document.getElementById("confirm-ok");

        if (!modal || !titleElement || !messageElement || !cancelButton || !confirmButton) {
            console.error("Erro: Elementos do modal não encontrados!");
            return;
        }

        // Definir título e mensagem do modal
        titleElement.textContent = title;
        messageElement.textContent = message;

        // Mostrar o modal
        modal.showModal();

        // Configurar os botões
        cancelButton.onclick = () => modal.close();
        modal.addEventListener("cancel", () => modal.close());

        confirmButton.onclick = () => {
            modal.close();
            if (onConfirm) onConfirm();
        };
    }

   // Adiciona o evento de clique a todos os botões "Excluir"
const btnsExcluir = document.getElementsByClassName("btn-excluir");

if (btnsExcluir.length > 0) {
    Array.from(btnsExcluir).forEach((btn) => {
        btn.addEventListener("click", function () {
    
            showConfirmModal(
                "Excluir Item",
                "Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.",
                function () {
                    alert("Item excluído!");
                }
            );
        });
    });
}

});
