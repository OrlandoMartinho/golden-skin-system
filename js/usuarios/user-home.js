// Funções específicas para a página de agendamentos
document.addEventListener('DOMContentLoaded', function() {
    // Funções para manipulação do carrinho (exemplo)
    function setupCart() {
        // Remover itens do carrinho
        document.querySelectorAll('.cart-item i.fa-times').forEach(icon => {
            icon.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                if (cartItem) {
                    cartItem.remove();
                    // Atualizar contador do carrinho
                    const count = document.querySelectorAll('.cart-item').length - 1; // -1 porque o total não conta
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = count;
                    }
                }
            });
        });

        // Outras funções relacionadas ao carrinho podem ser adicionadas aqui
    }

    // Funções específicas para agendamentos
    function setupAppointments() {
        // Aqui você pode adicionar lógica específica para agendamentos
        // Por exemplo, filtros, ordenação, etc.
        
        // Exemplo: Filtro por status
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const selectedStatus = this.value;
                // Implementar lógica de filtro aqui
                console.log('Filtrar por status:', selectedStatus);
            });
        }
    }

    // Inicialização
    setupCart();
    setupAppointments();
});