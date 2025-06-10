document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let salesData = [
        {
            idShopping: 1,
            idUser: 1,
            name: "João Silva",
            status: "completed",
            createdIn: "2025-06-01T10:00:00Z",
            updatedIn: "2025-06-01T12:00:00Z",
            PurchaseProducts: [
                {
                    idPurchaseProduct: 1,
                    idShopping: 1,
                    idProduct: 101,
                    productName: "Creme Hidratante",
                    priceInCents: 500000,
                    paymentMethod: "credit_card",
                    createdIn: "2025-06-01T10:00:00Z",
                    updatedIn: "2025-06-01T10:00:00Z"
                },
                {
                    idPurchaseProduct: 2,
                    idShopping: 1,
                    idProduct: 102,
                    productName: "Óleo de Massagem",
                    priceInCents: 300000,
                    paymentMethod: "credit_card",
                    createdIn: "2025-06-01T10:00:00Z",
                    updatedIn: "2025-06-01T10:00:00Z"
                }
            ]
        },
        {
            idShopping: 2,
            idUser: 2,
            name: "Maria Oliveira",
            status: "pending",
            createdIn: "2025-06-02T14:30:00Z",
            updatedIn: "2025-06-02T15:00:00Z",
            PurchaseProducts: [
                {
                    idPurchaseProduct: 3,
                    idShopping: 2,
                    idProduct: 103,
                    productName: "Kit Aromaterapia",
                    priceInCents: 750000,
                    paymentMethod: "bank_transfer",
                    createdIn: "2025-06-02T14:30:00Z",
                    updatedIn: "2025-06-02T14:30:00Z"
                }
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
            const total = sale.PurchaseProducts.reduce((sum, item) => sum + item.priceInCents, 0) / 100;
            const paymentMethods = [...new Set(sale.PurchaseProducts.map(item => item.paymentMethod))].join(', ');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.idShopping}</td>
                <td>${sale.name}</td>
                <td>${new Date(sale.createdIn).toLocaleDateString('pt-BR')}</td>
                <td>AOA ${total.toFixed(2)}</td>
                <td>${paymentMethods}</td>
                <td><span class="status-${sale.status}">${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}</span></td>
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
        document.getElementById('sale-user').textContent = sale.name;
        document.getElementById('sale-date').textContent = new Date(sale.createdIn).toLocaleString('pt-BR');
        document.getElementById('sale-status').textContent = sale.status.charAt(0).toUpperCase() + sale.status.slice(1);
        // document.getElementById('sale-updated').textContent = new Date(sale.updatedIn).toLocaleString('pt-BR');

        const productsTable = document.getElementById('sale-products');
        productsTable.innerHTML = '';
        sale.PurchaseProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.idProduct}</td>
                <td>${product.productName}</td>
                <td>AOA ${(product.priceInCents / 100).toFixed(2)}</td>
                <td>${product.paymentMethod}</td>
                <td>${new Date(product.createdIn).toLocaleString('pt-BR')}</td>
                <td>${new Date(product.updatedIn).toLocaleString('pt-BR')}</td>
            `;
            productsTable.appendChild(row);
        });

        const total = sale.PurchaseProducts.reduce((sum, item) => sum + item.priceInCents, 0) / 100;
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
            const matchesSearch = sale.name.toLowerCase().includes(search) ||
                sale.idShopping.toString().includes(search);
            const matchesStatus = statusFilterValue === 'all' ||
                sale.status === statusFilterValue;
            const matchesPayment = paymentFilterValue === 'all' ||
                sale.PurchaseProducts.some(p => p.paymentMethod === paymentFilterValue);
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
    // Função para abrir o modal de confirmação
window.openConfirmModal = function(actionType, message) {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmButton = document.getElementById('confirm-button');
    
    if (!confirmModal || !confirmMessage || !confirmButton) return;
    
    // Configura a mensagem e a ação do botão Confirmar
    confirmMessage.textContent = message;
    
    // Remove event listeners anteriores para evitar duplicação
    confirmButton.replaceWith(confirmButton.cloneNode(true));
    const newConfirmButton = document.getElementById('confirm-button');
    
    // Configura a ação com base no tipo
    if (actionType === 'confirmSale') {
        newConfirmButton.onclick = function() {
            approveSale();
            closeModal('confirm-modal');
        };
    } else if (actionType === 'cancelSale') {
        newConfirmButton.onclick = function() {
            cancelSale();
            closeModal('confirm-modal');
        };
    }
    
    confirmModal.classList.add('active');
};

// Função para aprovar uma venda
async function approveSale() {
    const accessToken = localStorage.getItem('accessToken');
    const saleId = document.getElementById('sale-id').textContent;
    
    try {
        // Simulação de chamada à API - substitua pelo código real
        // const result = await updateSaleStatus(accessToken, saleId, 'completed');
        // if (result !== 200) throw new Error();
        
        // Atualiza localmente para demonstração
        const saleIndex = salesData.findIndex(s => s.idShopping == saleId);
        if (saleIndex !== -1) {
            salesData[saleIndex].status = 'completed';
            salesData[saleIndex].updatedIn = new Date().toISOString();
            
            // Atualiza a tabela
            populateSalesTable(salesData);
            
            // Atualiza o modal se estiver aberto
            if (document.getElementById('sale-modal').classList.contains('active')) {
                document.getElementById('sale-status').textContent = 'Completed';
            }
            
            showMessageModal('success', 'Sucesso!', 'Venda aprovada com sucesso.', { buttonText: 'OK' });
        }
    } catch (error) {
        showMessageModal('error', 'Erro!', 'Falha ao aprovar a venda.', { buttonText: 'Entendido' });
    }
}

// Função para cancelar uma venda
async function cancelSale() {
    const accessToken = localStorage.getItem('accessToken');
    const saleId = document.getElementById('sale-id').textContent;
    
    try {
        // Simulação de chamada à API - substitua pelo código real
        // const result = await updateSaleStatus(accessToken, saleId, 'cancelled');
        // if (result !== 200) throw new Error();
        
        // Atualiza localmente para demonstração
        const saleIndex = salesData.findIndex(s => s.idShopping == saleId);
        if (saleIndex !== -1) {
            salesData[saleIndex].status = 'cancelled';
            salesData[saleIndex].updatedIn = new Date().toISOString();
            
            // Atualiza a tabela
            populateSalesTable(salesData);
            
            // Atualiza o modal se estiver aberto
            if (document.getElementById('sale-modal').classList.contains('active')) {
                document.getElementById('sale-status').textContent = 'Cancelled';
            }
            
            showMessageModal('success', 'Sucesso!', 'Venda cancelada com sucesso.', { buttonText: 'OK' });
        }
    } catch (error) {
        showMessageModal('error', 'Erro!', 'Falha ao cancelar a venda.', { buttonText: 'Entendido' });
    }
}

// Função para exportar venda em PDF
window.exportSale = function() {
    const saleId = document.getElementById('sale-id').textContent;
    const sale = salesData.find(s => s.idShopping == saleId);
    
    if (!sale) {
        showMessageModal('error', 'Erro!', 'Venda não encontrada para exportação.', { buttonText: 'Entendido' });
        return;
    }
    
    // Cria um novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações do PDF
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.setTextColor(40);
    
    // Cabeçalho
    doc.text('Comprovante de Venda - Pele Douro', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Nº da Venda: ${sale.idShopping}`, 14, 30);
    doc.text(`Data: ${new Date(sale.createdIn).toLocaleDateString('pt-BR')}`, 14, 36);
    doc.text(`Cliente: ${sale.name}`, 14, 42);
    doc.text(`Status: ${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}`, 14, 48);
    
    // Linha divisória
    doc.setDrawColor(200);
    doc.line(14, 52, 196, 52);
    
    // Título da tabela de produtos
    doc.setFontSize(14);
    doc.text('Produtos Adquiridos', 14, 60);
    
    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.setFillColor(240);
    doc.rect(14, 64, 182, 8, 'F');
    doc.text('Produto', 16, 68);
    doc.text('Preço Unitário', 100, 68);
    doc.text('Pagamento', 150, 68);
    doc.text('Quantia', 180, 68, { align: 'right' });
    
    // Linhas dos produtos
    let y = 74;
    const total = sale.PurchaseProducts.reduce((sum, item) => sum + item.priceInCents, 0) / 100;
    
    sale.PurchaseProducts.forEach((product, index) => {
        if (y > 260 && index < sale.PurchaseProducts.length - 1) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(product.productName, 16, y);
        doc.text(`AOA ${(product.priceInCents / 100).toFixed(2)}`, 100, y);
        doc.text(formatPaymentMethod(product.paymentMethod), 150, y);
        doc.text('1', 180, y, { align: 'right' });
        y += 6;
    });
    
    // Total
    doc.setFontSize(12);
    doc.setDrawColor(200);
    doc.line(140, y + 4, 196, y + 4);
    doc.text('Total:', 140, y + 10);
    doc.text(`AOA ${total.toFixed(2)}`, 180, y + 10, { align: 'right' });
    
    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Obrigado por escolher Pele Douro!', 105, 285, { align: 'center' });
    doc.text('Em caso de dúvidas, entre em contato com nosso suporte.', 105, 290, { align: 'center' });
    
    // Salva o PDF
    doc.save(`venda_${sale.idShopping}.pdf`);
    showMessageModal('success', 'Sucesso!', 'PDF gerado com sucesso.', { buttonText: 'OK' });
};

// Função auxiliar para formatar método de pagamento
function formatPaymentMethod(method) {
    const methods = {
        'credit_card': 'Cartão de Crédito',
        'debit_card': 'Cartão de Débito',
        'cash': 'Dinheiro',
        'bank_transfer': 'Transferência Bancária'
    };
    return methods[method] || method;
}
});