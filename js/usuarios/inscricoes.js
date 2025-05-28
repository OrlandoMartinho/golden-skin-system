document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".menu-btn");

    menuButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Impede o evento de propagação para o documento

            // Fecha todos os outros modais antes de abrir um novo
            document.querySelectorAll(".mini-modal").forEach(modal => modal.close());

            const modal = this.parentElement.querySelector(".mini-modal"); // Obtém o modal dentro do cartão
            
            if (modal) {
                // Obtém as coordenadas do botão clicado
                const rect = this.getBoundingClientRect();

             // Ajuste conforme necessário
                
                modal.show(); // Exibe o modal
            }
        });
    });

    // Fecha o modal ao clicar fora
    document.addEventListener("click", function (event) {
        document.querySelectorAll(".mini-modal").forEach(modal => {
            if (!modal.contains(event.target) && !event.target.classList.contains("menu-btn")) {
                modal.close();
            }
        });
    });
});

