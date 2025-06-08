document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let salesData = [
        {
            idShopping: 1,
            idUser: 1,
            userName: "João Silva",
            status: true,
            createdIn: "2025-06-01T10:00:00Z",
            purchaseProducts: [
                { idPurchaseProduct: 1, productName: "Creme Hidratante", priceInCents: 500000, paymentMethod: "credit_card" },
                { idPurchaseProduct: 2, productName: "Óleo de Massagem", priceInCents: 300000, paymentMethod: "credit_card" }
            ]
        },
        {
            idShopping: 2,
            idUser: 2,
            userName: "Maria Oliveira",
            status: false,
            createdIn: "2025-06-02T14:30:00Z",
            purchaseProducts: [
                { idPurchaseProduct: 3, productName: "Kit Aromaterapia", priceInCents: 750000, paymentMethod: "bank_transfer" }
            ]
        }
    ];

    const salesTableBody = document.querySelector('.sales-table tbody');
    const salesSearch = document.getElementById('sales-search');
    const saleStatusFilter = document.getElementById('sale-status-filter');
    const paymentMethodFilter = document.getElementById('payment-method-filter');

    // Initialize Sales
    async function initializeSales() {
        try {
            // Simulate API call to fetch sales
            // const result = await getAllSales(accessToken);
            // if (result === 200) {
            //     salesData = JSON.parse(localStorage.getItem('sales')) || [];
            //     populateSalesTable(salesData);
            // } else {
            //     showMessageModal('error', 'Erro!', 'Falha ao carregar vendas', { buttonText: 'Entendido' });
            // }
            populateSalesTable(salesData);
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', { buttonText: 'Entendido' });
        }
    }

    // Populate Sales Table
    function populateSalesTable(sales) {
        if (!salesTableBody) return;

        salesTableBody.innerHTML = '';
        sales.forEach(sale => {
            const total = sale.purchaseProducts.reduce((sum, item) => sum + item.priceInCents, 0) / 100;
            const paymentMethods = [...new Set(sale.purchaseProducts.map(item => item.paymentMethod))].join(', ');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.idShopping}</td>
                <td>${sale.userName}</td>
                <td>${new Date(sale.createdIn).toLocaleDateString('pt-BR')}</td>
                <td>AOA ${total.toFixed(2)}</td>
                <td>${paymentMethods}</td>
                <td><span class="status-${sale.status ? 'completed' : 'pending'}">${sale.status ? 'Concluída' : 'Pendente'}</span></td>
                <td>
                    <button class="action-btn" onclick="viewSaleDetails(${sale.idShopping})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            salesTableBody.appendChild(row);
        });
    }

    // View Sale Details
    window.viewSaleDetails = function(id) {
        const sale = salesData.find(s => s.idShopping === id);
        if (!sale) {
            showMessageModal('error', 'Erro!', 'Venda não encontrada', { buttonText: 'Entendido' });
            return;
        }

        document.getElementById('sale-id').textContent = sale.idShopping;
        document.getElementById('sale-user').textContent = sale.userName;
        document.getElementById('sale-date').textContent = new Date(sale.createdIn).toLocaleString('pt-BR');
        document.getElementById('sale-status').textContent = sale.status ? 'Concluída' : 'Pendente';
        
        const productsTable = document.getElementById('sale-products');
        productsTable.innerHTML = '';
        sale.purchaseProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>AOA ${(product.priceInCents / 100).toFixed(2)}</td>
                <td>${product.paymentMethod}</td>
            `;
            productsTable.appendChild(row);
        });

        const total = sale.purchaseProducts.reduce((sum, item) => sum + item.priceInCents, 0) / 100;
        document.getElementById('sale-total').textContent = `AOA ${total.toFixed(2)}`;

        const modal = document.getElementById('sale-modal');
        if (modal) {
            modal.classList.add('active');
        }
    };

    // Filter Sales
    function filterSales() {
        if (!salesSearch || !saleStatusFilter || !paymentMethodFilter) return;

        const search = salesSearch.value.toLowerCase().trim();
        const statusFilterValue = saleStatusFilter.value;
        const paymentFilterValue = paymentMethodFilter.value;

        const filteredSales = salesData.filter(sale => {
            const matchesSearch = sale.userName.toLowerCase().includes(search) ||
                sale.idShopping.toString().includes(search);
            const matchesStatus = statusFilterValue === 'all' ||
                (statusFilterValue === 'true' && sale.status) ||
                (statusFilterValue === 'false' && !sale.status);
            const matchesPayment = paymentFilterValue === 'all' ||
                sale.purchaseProducts.some(p => p.paymentMethod === paymentFilterValue);
            return matchesSearch && matchesStatus && matchesPayment;
        });

        populateSalesTable(filteredSales);
    }

    // Event Listeners
    if (salesSearch) {
        salesSearch.addEventListener('input', filterSales);
    }

    if (saleStatusFilter) {
        saleStatusFilter.addEventListener('change', filterSales);
    }

    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', filterSales);
    }

    // Modal Control
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    window.confirmAction = function() {
        const modal = document.getElementById('confirm-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Initialize
    await initializeSales();
});