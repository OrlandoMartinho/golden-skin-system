// === Image Preview Handler ===
document.getElementById('product-photo').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photo-preview');

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
        showMessageModal('error', 'Erro!', 'Por favor, selecione uma imagem válida (JPEG ou PNG).', { buttonText: 'Entendido' });
    }
});

// === Main Application Logic ===
document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let productsData = [];

    // === Initialize Products ===
    async function initializeProducts() {
        try {
            const result = await getAllProducts(accessToken);

            if (result === 200) {
                const storedProducts = localStorage.getItem('products');
                productsData = storedProducts ? JSON.parse(storedProducts) : [];
                populateProductsTable(productsData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar produtos', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', { buttonText: 'Entendido' });
        }
    }

    // === Populate Products Table ===
    function populateProductsTable(products) {
        const tbody = document.querySelector('.products-table tbody');
        if (!tbody) {
            return;
        }

        tbody.innerHTML = '';
        products.forEach((product) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.photo ? `<img src="${product.photo}" alt="${product.name}" style="max-width: 50px; max-height: 50px;">` : '-'}</td>
                <td>${product.name || '-'}</td>
                <td>${product.category || '-'}</td>
                <td>${((product.priceInCents || 0) / 100).toFixed(2)}</td>
                <td>${product.amount || '-'}</td>
                <td><span class="status-${product.status ? 'active' : 'inactive'}">${product.status ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="action-btn" onclick="editProduct(${product.idProduct})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteProduct(${product.idProduct})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // === Modal Control Functions ===
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

        if (action.startsWith('deleteProduct-')) {
            const productId = parseInt(action.split('-')[1]);
            try {
                const result = await deleteAnyProduct(accessToken, productId);
                if (result === 200) {
                    productsData = productsData.filter((p) => p.idProduct !== productId);
                    populateProductsTable(productsData);
                    showMessageModal('success', 'Sucesso!', 'Produto eliminado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao excluir o produto', { buttonText: 'Entendido' });
                }
            } catch (error) {
                showMessageModal('error', 'Erro!', 'Ocorreu um erro ao excluir o produto', { buttonText: 'Entendido' });
            }
        }
        modal.classList.remove('active');
    };

    // === Product Modal Functions ===
    window.openAddProductModal = function () {
        const modal = document.getElementById('product-modal');
        const form = document.getElementById('product-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) {
            return;
        }

        title.textContent = 'Adicionar Produto';
        form.reset();
        modal.classList.add('active');
    };

    window.editProduct = async function (productId) {
        const modal = document.getElementById('product-modal');
        const form = document.getElementById('product-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) {
            return;
        }

        try {
            const result = await getProduct(accessToken, productId);
            if (result === 200) {
                const product = JSON.parse(localStorage.getItem('product'));
                if (product) {
                    title.textContent = 'Editar Produto';
                    document.getElementById('product-name').value = product.name || '';
                    document.getElementById('product-category').value = product.category || '';
                    document.getElementById('product-price').value = ((product.priceInCents || 0) / 100).toFixed(2);
                    document.getElementById('product-stock').value = product.amount || 0;
                    document.getElementById('product-status').value = product.status ? 'active' : 'inactive';
                    form.dataset.productId = productId;
                    
                    // Mostrar a imagem atual do produto no preview
                    const preview = document.getElementById('photo-preview');
                    if (product.photo) {
                        preview.src = product.photo;
                        preview.style.display = 'block';
                    } else {
                        preview.src = '#';
                        preview.style.display = 'none';
                    }
                    
                    modal.classList.add('active');
                } else {
                    showMessageModal('error', 'Erro!', 'Produto não encontrado', { buttonText: 'Entendido' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar o produto', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar o produto', { buttonText: 'Entendido' });
        }
    };

    window.deleteProduct = function (productId) {
        showConfirmModal(`Tem certeza que deseja excluir o produto ${productId}?`, `deleteProduct-${productId}`);
    };

    // === Form Submission Handler ===
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const productId = parseInt(e.target.dataset.productId) || null;
        const name = document.getElementById('product-name').value.trim();
        const category = document.getElementById('product-category').value.trim();
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const status = document.getElementById('product-status').value === 'active';

        // Client-side validation
        if (!name || !category || isNaN(price) || isNaN(stock)) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            return;
        }

        if (price < 0) {
            showMessageModal('error', 'Erro!', 'O preço não pode ser negativo.', { buttonText: 'Entendido' });
            return;
        }

        if (stock < 0) {
            showMessageModal('error', 'Erro!', 'O estoque não pode ser negativo.', { buttonText: 'Entendido' });
            return;
        }

        const productData = {
            name,
            description: name,
            priceInCents: Math.round(price * 100),
            status,
            category,
            amount: stock,
        };

        try {
            if (productId) {
                // Update existing product
                productData.idProduct = productId;
                const fileInput = document.getElementById('product-photo');
                const file = fileInput.files[0];
                const response = await updateProduct(accessToken, productData, file);
                if (response === 200) {
                    const index = productsData.findIndex((p) => p.idProduct === productId);
                    if (index !== -1) {
                        productsData[index] = {
                            ...productsData[index],
                            ...productData,
                            updatedIn: new Date().toISOString(),
                        };
                        populateProductsTable(productsData);
                        showMessageModal('success', 'Sucesso!', 'Produto atualizado com sucesso', { buttonText: 'Ótimo!' });
                    }
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao atualizar o produto', { buttonText: 'Entendido' });
                }
            } else {
                // Add new product
                const fileInput = document.getElementById('product-photo');
                const file = fileInput.files[0];
                const response = await registerProduct(accessToken, productData, file);
                
                if (response === 200) {
                    await getAllProducts(accessToken);
                    productsData = JSON.parse(localStorage.getItem('products')) || [];
                    populateProductsTable(productsData);
                    showMessageModal('success', 'Sucesso!', 'Produto criado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao criar o produto', { buttonText: 'Entendido' });
                }
            }
            closeModal('product-modal');
            e.target.dataset.productId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o produto', { buttonText: 'Entendido' });
        }
    });

    // === Search and Filter Functionality ===
    const searchInput = document.getElementById('product-search');
    const statusFilter = document.getElementById('product-status-filter');
    const categoryFilter = document.getElementById('product-category-filter');

    function filterProducts() {
        if (!searchInput || !statusFilter || !categoryFilter) {
            return;
        }

        const search = searchInput.value.toLowerCase().trim();
        const statusFilterValue = statusFilter.value;
        const categoryFilterValue = categoryFilter.value;

        const filteredProducts = productsData.filter((product) => {
            const matchesSearch = (product.name || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' ||
                (statusFilterValue === 'active' && product.status) ||
                (statusFilterValue === 'inactive' && !product.status);
            const matchesCategory =
                categoryFilterValue === 'all' || (product.category || '').toLowerCase() === categoryFilterValue.toLowerCase();
            return matchesSearch && matchesStatus && matchesCategory;
        });
        populateProductsTable(filteredProducts);
    }

    // Attach event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    // === Helper Functions ===
    function showConfirmModal(message, action) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');

        if (!modal || !messageElement) {
            return;
        }

        messageElement.textContent = message;
        messageElement.dataset.action = action;
        modal.classList.add('active');
    }

    // Initialize products on load
    await initializeProducts();
});