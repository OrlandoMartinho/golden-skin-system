document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let salesData = [];

    async function initializeSales() {
        try {
            const result = await getAllSales(accessToken);

            if (result === 200) {
                const storedSales = localStorage.getItem('sales');
                salesData = storedSales ? JSON.parse(storedSales) : [];
                populateSalesTable(salesData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar vendas', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', { buttonText: 'Entendido' });
        }
    }

    function populateSalesTable(sales) {
        const tbody = document.querySelector('.sales-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        sales.forEach((sale) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.idSale || '-'}</td>
                <td>${sale.client || '-'}</td>
                <td>${sale.type || '-'}</td>
                <td>${((sale.valueInCents || 0) / 100).toFixed(2)}</td>
                <td>${sale.date ? new Date(sale.date).toLocaleDateString('pt-BR') : '-'}</td>
                <td><span class="status-${sale.status.toLowerCase()}">${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}</span></td>
                <td>
                    <button class="action-btn" onclick="openApproveSaleModal(${sale.idSale})">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="action-btn" onclick="deleteSale(${sale.idSale})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    window.openApproveSaleModal = function (saleId) {
        const modal = document.getElementById('approve-modal');
        const form = document.getElementById('approve-form');
        const message = document.getElementById('approve-message');

        if (!modal || !form || !message) return;

        message.textContent = `Gerenciar o status da venda ${saleId}`;
        form.dataset.saleId = saleId;
        const sale = salesData.find(s => s.idSale === saleId);
        if (sale) {
            document.getElementById('sale-status').value = sale.status.toLowerCase() === 'pending' ? 'completed' : sale.status.toLowerCase();
        }
        modal.classList.add('active');
    };

    window.confirmAction = async function () {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        const action = messageElement.dataset.action;
        const confirmButton = document.getElementById('confirm-button');

        const originalConfirmText = confirmButton.innerHTML;
        confirmButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        confirmButton.disabled = true;

        if (action.startsWith('deleteSale-')) {
            const saleId = parseInt(action.split('-')[1]);
            try {
                const result = await deleteAnySale(accessToken, saleId);
                if (result === 200) {
                    salesData = salesData.filter((s) => s.idSale !== saleId);
                    populateSalesTable(salesData);
                    showMessageModal('success', 'Sucesso!', 'Venda eliminada com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao excluir a venda', { buttonText: 'Entendido' });
                }
            } catch (error) {
                showMessageModal('error', 'Erro!', 'Ocorreu um erro ao excluir a venda', { buttonText: 'Entendido' });
            }
        }

        confirmButton.innerHTML = originalConfirmText;
        confirmButton.disabled = false;
        modal.classList.remove('active');
    };

    window.deleteSale = function (saleId) {
        showConfirmModal(`Tem certeza que deseja excluir a venda ${saleId}?`, `deleteSale-${saleId}`);
    };

    document.getElementById('approve-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const saleId = parseInt(e.target.dataset.saleId);
        const status = document.getElementById('sale-status').value;

        if (!saleId || !status) {
            showMessageModal('error', 'Erro!', 'Dados inválidos para atualizar o status.', { buttonText: 'Entendido' });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        try {
            const saleData = { idSale: saleId, status };
            const response = await editAnySale(accessToken, saleData);
            if (response === 200) {
                const index = salesData.findIndex((s) => s.idSale === saleId);
                if (index !== -1) {
                    salesData[index].status = status;
                    populateSalesTable(salesData);
                    showMessageModal('success', 'Sucesso!', `Venda ${status === 'completed' ? 'aprovada' : 'invalidada'} com sucesso`, { buttonText: 'Ótimo!' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao atualizar o status da venda', { buttonText: 'Entendido' });
            }
            closeModal('approve-modal');
            e.target.dataset.saleId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o status da venda', { buttonText: 'Entendido' });
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
        }
    });

    const searchInput = document.getElementById('sale-search');
    const statusFilter = document.getElementById('sale-status-filter');
    const typeFilter = document.getElementById('sale-type-filter');

    function filterSales() {
        if (!searchInput || !statusFilter || !typeFilter) return;

        const search = searchInput.value.toLowerCase().trim();
        const statusFilterValue = statusFilter.value;
        const typeFilterValue = typeFilter.value;

        const filteredSales = salesData.filter((sale) => {
            const matchesSearch = (sale.client || '').toLowerCase().includes(search) || 
                                 (sale.item || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' ||
                (sale.status.toLowerCase() === statusFilterValue.toLowerCase());
            const matchesType =
                typeFilterValue === 'all' || (sale.type || '').toLowerCase() === typeFilterValue.toLowerCase();
            return matchesSearch && matchesStatus && matchesType;
        });
        populateSalesTable(filteredSales);
    }

    if (searchInput) searchInput.addEventListener('input', filterSales);
    if (statusFilter) statusFilter.addEventListener('change', filterSales);
    if (typeFilter) typeFilter.addEventListener('change', filterSales);

    function showConfirmModal(message, action) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        if (!modal || !messageElement) return;

        messageElement.textContent = message;
        messageElement.dataset.action = action;
        modal.classList.add('active');
    }

    await initializeSales();
});