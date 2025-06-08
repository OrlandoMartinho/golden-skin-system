/**
 * admin-sales.js
 * Script para gerenciar a tela de vendas no painel administrativo
 * Controla a busca, filtragem, adição, edição, exclusão e confirmação de vendas
 */

let saleDataToConfirm = null;

// Função para carregar a lista de vendas
function loadSales(search = '', paymentFilter = 'all', statusFilter = 'all') {
    getSales().then(sales => {
        const tbody = document.querySelector('.sales-table tbody');
        tbody.innerHTML = ''; // Limpa a tabela

        sales
            .filter(sale => {
                const matchesSearch = sale.productName.toLowerCase().includes(search.toLowerCase());
                const matchesPayment = paymentFilter === 'all' || sale.paymentMethod === paymentFilter;
                const matchesStatus = statusFilter === 'all' || sale.estado === statusFilter;
                return matchesSearch && matchesPayment && matchesStatus;
            })
            .forEach(sale => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sale.idShopping}</td>
                    <td>${sale.idProduct}</td>
                    <td>${sale.productName}</td>
                    <td>${(sale.priceInCents / 100).toFixed(2)}</td>
                    <td>${sale.paymentMethod}</td>
                    <td>${sale.estado}</td>
                    <td>
                        <button onclick="openEditSaleModal(${sale.idShopping})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="openDeleteSaleModal(${sale.idShopping})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
    }).catch(error => {
        console.error('Erro ao carregar vendas:', error);
        showMessage('Erro ao carregar vendas', 'error');
    });
}

// Função para abrir o modal de adição de venda
function openAddSaleModal() {
    document.getElementById('modal-title').textContent = 'Registrar Venda';
    document.getElementById('sale-form').reset();
    document.getElementById('sale-id').value = '';
    document.getElementById('sale-modal').style.display = 'block';
}

// Função para abrir o modal de edição de venda
function openEditSaleModal(id) {
    getSaleById(id).then(sale => {
        document.getElementById('modal-title').textContent = 'Editar Venda';
        document.getElementById('sale-id').value = sale.idShopping;
        document.getElementById('sale-product-id').value = sale.idProduct;
        document.getElementById('sale-product-name').value = sale.productName;
        document.getElementById('sale-price').value = (sale.priceInCents / 100).toFixed(2);
        document.getElementById('sale-payment-method').value = sale.paymentMethod;
        document.getElementById('sale-status').value = sale.estado;
        document.getElementById('sale-modal').style.display = 'block';
    }).catch(error => {
        console.error('Erro ao carregar venda:', error);
        showMessage('Erro ao carregar venda', 'error');
    });
}

// Função para abrir o modal de confirmação de venda
function openConfirmSaleModal() {
    saleDataToConfirm = {
        idShopping: document.getElementById('sale-id').value || null,
        idProduct: parseInt(document.getElementById('sale-product-id').value),
        priceInCents: Math.round(parseFloat(document.getElementById('sale-price').value) * 100),
        productName: document.getElementById('sale-product-name').value,
        paymentMethod: document.getElementById('sale-payment-method').value,
        estado: document.getElementById('sale-status').value
    };

    document.getElementById('confirm-product-name').textContent = saleDataToConfirm.productName;
    document.getElementById('confirm-price').textContent = (saleDataToConfirm.priceInCents / 100).toFixed(2);
    document.getElementById('confirm-sale-modal').style.display = 'block';
}

// Função para confirmar a venda
function confirmSaleAction() {
    if (saleDataToConfirm) {
        const isEdit = saleDataToConfirm.idShopping !== null;
        const action = isEdit ? updateSale : createSale;

        action(saleDataToConfirm).then(() => {
            closeModal('confirm-sale-modal');
            closeModal('sale-modal');
            loadSales(); // Recarrega a lista de vendas
            showMessage(`Venda ${isEdit ? 'atualizada' : 'registrada'} com sucesso!`, 'success');
            saleDataToConfirm = null;
        }).catch(error => {
            console.error(`Erro ao ${isEdit ? 'atualizar' : 'registrar'} venda:`, error);
            showMessage(`Erro ao ${isEdit ? 'atualizar' : 'registrar'} venda`, 'error');
        });
    }
}

// Função para abrir o modal de exclusão
function openDeleteSaleModal(id) {
    document.getElementById('confirm-message').textContent = `Deseja excluir a venda ID ${id}?`;
    document.getElementById('confirm-button').onclick = () => confirmDeleteAction(id);
    document.getElementById('confirm-modal').style.display = 'block';
}

// Função para confirmar a exclusão
function confirmDeleteAction(id) {
    deleteSale(id).then(() => {
        closeModal('confirm-modal');
        loadSales(); // Recarrega a lista de vendas
        showMessage('Venda excluída com sucesso!', 'success');
    }).catch(error => {
        console.error('Erro ao excluir venda:', error);
        showMessage('Erro ao excluir venda', 'error');
    });
}

// Função para fechar modais
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    saleDataToConfirm = null; // Limpa os dados temporários
}

// Função para exibir mensagens (assume que está em messageModal.js)
function showMessage(message, type) {
    // Implementação depende de messageModal.js
    console.log(`${type}: ${message}`);
}

// Event Listeners
document.getElementById('sale-form').addEventListener('submit', function (e) {
    e.preventDefault();
    openConfirmSaleModal();
});

document.getElementById('sale-search').addEventListener('input', function () {
    const search = this.value;
    const paymentFilter = document.getElementById('sale-payment-filter').value;
    const statusFilter = document.getElementById('sale-status-filter').value;
    loadSales(search, paymentFilter, statusFilter);
});

document.getElementById('sale-payment-filter').addEventListener('change', function () {
    const search = document.getElementById('sale-search').value;
    const statusFilter = document.getElementById('sale-status-filter').value;
    loadSales(search, this.value, statusFilter);
});

document.getElementById('sale-status-filter').addEventListener('change', function () {
    const search = document.getElementById('sale-search').value;
    const paymentFilter = document.getElementById('sale-payment-filter').value;
    loadSales(search, paymentFilter, this.value);
});

// Carrega as vendas ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadSales();
});