document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("seguranca-modalDialog");
    const closeModal = document.getElementById("seguranca-closeModal");
    const tabs = document.querySelectorAll(".seguranca-tab");
    const tabContents = document.querySelectorAll(".seguranca-tab-content");

    // Abre o modal
    function abrirModal() {
        modal.showModal();
    }

    // Fecha o modal
    function fecharModal() {
        modal.close();
    }

    // Fecha ao clicar no botão de fechar
    closeModal.addEventListener("click", fecharModal);

    // Fecha ao clicar fora do modal
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Alternância entre abas
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Remove a classe ativa de todas as abas e conteúdos
            tabs.forEach(t => t.classList.remove("ativa"));
            tabContents.forEach(content => content.classList.remove("ativo"));

            // Ativa a aba clicada e seu conteúdo correspondente
            this.classList.add("ativa");
            const targetId = this.getAttribute("data-tab");
            document.getElementById(targetId).classList.add("ativo");
        });
    });

    // Exemplo: Abrir modal ao clicar em um botão (substituir pelo ID do botão que abre o modal)
    document.getElementById("abrir-modal").addEventListener("click", abrirModal);
});
