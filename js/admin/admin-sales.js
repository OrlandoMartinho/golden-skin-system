async function urlToFile(photo) {
    try {
        console.log('Starting urlToFile function with photo URL:', photo);

        // Extrai o nome do arquivo do URL
        const filename = photo.split('/').pop();
        console.log('Extracted filename:', filename);

        // Extrai a extensão do arquivo do URL
        const extension = filename.split('.').pop().toLowerCase();
        console.log('Extracted extension:', extension);

        // Mapeia a extensão para o tipo MIME
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
        };

        const mimeType = mimeTypes[extension] || 'application/octet-stream';
        console.log('Determined mimeType:', mimeType);

        // Faz o fetch da imagem
        console.log('Fetching image from URL...');
        const response = await fetch(photo);
        if (!response.ok) {
            console.error('Fetch failed with status:', response.status);
            throw new Error('Falha ao carregar a imagem');
        }

        // Converte a resposta em um blob
        console.log('Converting response to blob...');
        const blob = await response.blob();
        console.log('Blob created with size:', blob.size, 'bytes and type:', blob.type);

        // Cria um objeto File a partir do blob
        const file = new File([blob], filename, { type: mimeType });
        console.log('File created:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });

        return file;
    } catch (error) {
        console.error('Error in urlToFile:', error);
        return null;
    }
}

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
                    <button class="action-btn" onclick="editSale(${sale.idSale})">
                        <i class="fas fa-edit"></i>
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

    window.openAddSaleModal = function () {
        const modal = document.getElementById('sale-modal');
        const form = document.getElementById('sale-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) return;

        title.textContent = 'Adicionar Venda';
        form.reset();
        modal.classList.add('active');
    };

    window.editSale = async function (saleId) {
        const modal = document.getElementById('sale-modal');
        const form = document.getElementById('sale-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title || !saleId) {
            showMessageModal('error', 'Erro!', 'Venda não encontrada', { buttonText: 'Entendido' });
            return;
        }

        try {
            const result = await getSale(accessToken, saleId);
            if (result === 200) {
                const sale = JSON.parse(localStorage.getItem('sale'));
                console.log('Sale data loaded:', sale);
                if (sale) {
                    localStorage.setItem("idSale", sale.idSale);
                    title.textContent = 'Editar Venda';
                    document.getElementById('sale-client').value = sale.client || '';
                    document.getElementById('sale-type').value = sale.type || '';
                    document.getElementById('sale-item').value = sale.item || '';
                    document.getElementById('sale-value').value = ((sale.valueInCents || 0) / 100).toFixed(2);
                    document.getElementById('sale-date').value = sale.date ? new Date(sale.date).toISOString().split('T')[0] : '';
                    document.getElementById('sale-status').value = sale.status.toLowerCase() || 'pending';
                    form.dataset.saleId = sale.idSale;
                    console.log('Form populated with sale ID:', sale.idSale);
                    modal.classList.add('active');
                } else {
                    showMessageModal('error', 'Erro!', 'Venda não encontrada', { buttonText:'Entendido' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar a venda', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar a venda', { buttonText: 'Entendido' });
        }
    };

    window.deleteSale = function (saleId) {
        showConfirmModal(`Tem certeza que deseja excluir a venda ${saleId}?`, `deleteSale-${saleId}`);
    };

    document.getElementById('sale-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const saleId = parseInt(e.target.dataset.saleId) || null;
        const client = document.getElementById('sale-client').value.trim();
        const type = document.getElementById('sale-type').value.trim();
        const item = document.getElementById('sale-item').value.trim();
        const value = parseFloat(document.getElementById('sale-value').value);
        const date = document.getElementById('sale-date').value;
        const status = document.getElementById('sale-status').value;

        if (!client || !type || !item || isNaN(value) || !date) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        if (value < 0) {
            showMessageModal('error', 'Erro!', 'O valor não pode ser negativo.', { buttonText: 'Entendido' });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        const saleData = {
            client,
            type,
            item,
            valueInCents: Math.round(value * 100),
            date,
            status,
        };

        try {
            if (saleId) {
                saleData.idSale = saleId;
                const response = await editAnySale(accessToken, saleData);
                console.log('Edit sale response:', response);
                if (response === 200) {
                    const index = salesData.findIndex((s) => s.idSale === saleId);
                    if (index !== -1) {
                        salesData[index] = {
                            ...salesData[index],
                            ...saleData,
                            updatedIn: new Date().toISOString(),
                        };
                        populateSalesTable(salesData);
                        showMessageModal('success', 'Sucesso!', 'Venda atualizada com sucesso', { buttonText: 'Ótimo!' });
                    }
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao atualizar a venda', { buttonText: 'Entendido' });
                }
            } else {
                const response = await addSale(accessToken, saleData);
                if (response === 200) {
                    await getAllSales(accessToken);
                    salesData = JSON.parse(localStorage.getItem('sales')) || [];
                    populateSalesTable(salesData);
                    showMessageModal('success', 'Sucesso!', 'Venda criada com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao criar a venda', { buttonText: 'Entendido' });
                }
            }
            closeModal('sale-modal');
            e.target.dataset.saleId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar a venda', { buttonText: 'Entendido' });
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

function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}