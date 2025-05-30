document.addEventListener('DOMContentLoaded', function() {
            // Alternar entre abas
            const tabs = document.querySelectorAll('.history-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove a classe active de todas as abas e conteúdos
                    document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.history-content').forEach(c => c.classList.remove('active'));
                    
                    // Adiciona a classe active à aba clicada
                    this.classList.add('active');
                    
                    // Mostra o conteúdo correspondente
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });
            
            // Filtros para serviços
            const serviceStatusFilter = document.getElementById('service-status-filter');
            const serviceMonthFilter = document.getElementById('service-month-filter');
            
            // Filtros para compras
            const purchaseStatusFilter = document.getElementById('purchase-status-filter');
            const purchaseMonthFilter = document.getElementById('purchase-month-filter');
            
            // Adiciona listeners para os filtros
            [serviceStatusFilter, serviceMonthFilter, purchaseStatusFilter, purchaseMonthFilter].forEach(filter => {
                filter.addEventListener('change', function() {
                    const tab = this.closest('.history-content').id;
                    console.log(`Filtrando ${tab}:`, {
                        status: tab.includes('services') ? serviceStatusFilter.value : purchaseStatusFilter.value,
                        month: tab.includes('services') ? serviceMonthFilter.value : purchaseMonthFilter.value
                    });
                    
                    // Aqui você implementaria a lógica de filtragem real
                    // Por enquanto, apenas demonstração no console
                });
            });
            
            // Adiciona classe ativa ao item do menu de histórico
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'user-history.html') {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });