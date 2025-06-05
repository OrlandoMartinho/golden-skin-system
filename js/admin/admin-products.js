
document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOMContentLoaded event triggered");
  const accessToken = localStorage.getItem("accessToken");
  console.log("Retrieved accessToken:", accessToken);
  let productsData = [];

  // Fetch and populate products on load
  try {
    console.log("Fetching all products");
    const resultProducts = await getAllProducts(accessToken);
    console.log("getAllProducts result:", resultProducts);
    
    if (resultProducts === 200) {
      const storedProducts = localStorage.getItem("products");
      console.log("Retrieved products from localStorage:", storedProducts);
      productsData = storedProducts ? JSON.parse(storedProducts) : [];
      console.log("Parsed productsData:", productsData);
      populateProductsTable(productsData);
    } else {
      console.warn("Failed to fetch products, status:", resultProducts);
      showMessageModal('error', 'Erro!', 'Falha ao carregar produtos', {
        buttonText: 'Entendido'
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error.message, error.stack);
    showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', {
      buttonText: 'Entendido'
    });
  }

  // Function to populate the products table
  function populateProductsTable(products) {
    console.log("populateProductsTable called with products:", products);
    const tbody = document.querySelector('.products-table tbody');
    if (!tbody) {
      console.error("populateProductsTable: Table body not found");
      return;
    }
    
    console.log("Clearing existing table rows");
    tbody.innerHTML = '';

    products.forEach(product => {
      console.log("Processing product for table:", product);
      const row = document.createElement('tr');
      row.innerHTML = `
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
      console.log("Appending row for product ID:", product.idProduct);
      tbody.appendChild(row);
    });
    console.log("Table population complete");
  }

  // Modal control functions
  window.closeModal = function(modalId) {
    console.log("closeModal called with modalId:", modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      console.log(`Deactivated modal: ${modalId}`);
    } else {
      console.error(`closeModal: Modal ${modalId} not found`);
    }
  };

  window.confirmAction = async function() {
    console.log("confirmAction called");
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    const action = messageElement.dataset.action;
    console.log('Action confirmed:', action);

    if (action.startsWith('deleteProduct-')) {
      const productId = parseInt(action.split('-')[1]);
      console.log("Deleting product with ID:", productId);
      try {
        const result = await deleteProduct(accessToken, productId);
        console.log("deleteProduct result:", result);
        if (result === 200) {
          console.log("Product deleted successfully, updating productsData");
          productsData = productsData.filter(p => p.idProduct !== productId);
          console.log("Updated productsData:", productsData);
          populateProductsTable(productsData);
          showMessageModal('success', 'Sucesso!', 'Produto eliminado com sucesso', {
            buttonText: 'Ótimo!'
          });
        } else {
          console.warn("deleteProduct failed with status:", result);
          showMessageModal('error', 'Erro!', 'Falha ao excluir o produto', {
            buttonText: 'Entendido'
          });
        }
      } catch (error) {
        console.error("Error in deleteProduct:", error.message, error.stack);
        showMessageModal('error', 'Erro!', 'Ocorreu um erro ao excluir o produto', {
          buttonText: 'Entendido'
        });
      }
    }
    
    console.log("Closing confirm-modal");
    modal.classList.remove('active');
  };

  // Open add product modal
  window.openAddProductModal = function() {
    console.log("openAddProductModal called");
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');
    
    if (!modal || !form || !title) {
      console.error("openAddProductModal: Modal, form, or title not found");
      return;
    }
    
    title.textContent = 'Adicionar Produto';
    console.log("Set modal title to 'Adicionar Produto'");
    form.reset();
    console.log("Reset product form");
    modal.classList.add('active');
    console.log("Activated product modal");
  };

  // Edit product
  window.editProduct = async function(productId) {
    console.log("editProduct called with productId:", productId);
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');
    
    if (!modal || !form || !title) {
      console.error("editProduct: Modal, form, or title not found");
      return;
    }

    try {
      console.log("Fetching product with ID:", productId);
      const result = await getProduct(accessToken, productId);
      console.log("getProduct result:", result);
      if (result === 200) {
        const product = JSON.parse(localStorage.getItem("product"));
        console.log("Retrieved product from localStorage:", product);
        if (product) {
          title.textContent = 'Editar Produto';
          console.log("Set modal title to 'Editar Produto'");
          document.getElementById('product-name').value = product.name || '';
          document.getElementById('product-category').value = product.category || '';
          document.getElementById('product-price').value = ((product.priceInCents || 0) / 100).toFixed(2);
          document.getElementById('product-stock').value = product.stock || 0;
          document.getElementById('product-status').value = product.status ? 'active' : 'inactive';
          console.log("Populated form with product data:", {
            name: product.name,
            category: product.category,
            price: product.priceInCents / 100,
            stock: product.amount,
            status: product.status
          });
          form.dataset.productId = productId;
          console.log("Set form dataset.productId to:", productId);
          modal.classList.add('active');
          console.log("Activated product modal");
        } else {
          console.warn("editProduct: Product not found in localStorage");
          showMessageModal('error', 'Erro!', 'Produto não encontrado', {
            buttonText: 'Entendido'
          });
        }
      } else {
        console.warn("getProduct failed with status:", result);
        showMessageModal('error', 'Erro!', 'Falha ao carregar o produto', {
          buttonText: 'Entendido'
        });
      }
    } catch (error) {
      console.error("Error in editProduct:", error.message, error.stack);
      showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar o produto', {
        buttonText: 'Entendido'
      });
    }
  };

  // Delete product
  window.deleteProduct = function(productId) {
    console.log("deleteProduct called with productId:", productId);
    showConfirmModal(`Tem certeza que deseja excluir o produto ${productId}?`, `deleteProduct-${productId}`);
  };

  // Form submission
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Product form submitted");
    
    const productId = parseInt(e.target.dataset.productId) || null;
    console.log("Form productId:", productId);
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const status = document.getElementById('product-status').value === 'active';

    console.log("Collected form data:", { name, category, price, stock, status });

    // Client-side validation
    if (!name || !category || isNaN(price) || isNaN(stock)) {
      console.warn("Validation failed: Missing or invalid fields");
      showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
        buttonText: 'Entendido'
      });
      return;
    }

    if (price < 0) {
      console.warn("Validation failed: Negative price");
      showMessageModal('error', 'Erro!', 'O preço não pode ser negativo.', {
        buttonText: 'Entendido'
      });
      return;
    }

    if (stock < 0) {
      console.warn("Validation failed: Negative stock");
      showMessageModal('error', 'Erro!', 'O estoque não pode ser negativo.', {
        buttonText: 'Entendido'
      });
      return;
    }

    const productData = {
      name,
      description: name, // Assuming description same as name if not provided in form
      priceInCents: Math.round(price * 100),
      status,
      category,
      amount :stock
    };
    console.log("Prepared productData:", productData);

    try {
      if (productId) {
        // Update existing product
        console.log("Updating product with ID:", productId);
        productData.idProduct = productId;
        const response = await updateProduct(accessToken, productData);
        console.log("updateProduct response:", response);
        if (response === 200) {
          console.log("Product updated successfully, updating productsData");
          const index = productsData.findIndex(p => p.idProduct === productId);
          if (index !== -1) {
            productsData[index] = {
              ...productsData[index],
              ...productData,
              updatedIn: new Date().toISOString()
            };
            console.log("Updated productsData:", productsData[index]);
            populateProductsTable(productsData);
            showMessageModal('success', 'Sucesso!', 'Produto atualizado com sucesso', {
              buttonText: 'Ótimo!'
            });
          } else {
            console.warn("Product not found in productsData for ID:", productId);
          }
        } else {
          console.warn("updateProduct failed with status:", response);
          showMessageModal('error', 'Erro!', 'Falha ao atualizar o produto', {
            buttonText: 'Entendido'
          });
        }
      } else {
        // Add new product
        console.log("Registering new product");
        const response = await registerProduct(accessToken, productData);
        console.log("registerProduct response:", response);
        if (response === 200) {
          console.log("Product registered successfully, refreshing products list");
          await getAllProducts(accessToken); // Refresh products list
          productsData = JSON.parse(localStorage.getItem("products")) || [];
          console.log("Updated productsData:", productsData);
          populateProductsTable(productsData);
          showMessageModal('success', 'Sucesso!', 'Produto criado com sucesso', {
            buttonText: 'Ótimo!'
          });
        } else {
          console.warn("registerProduct failed with status:", response);
          showMessageModal('error', 'Erro!', 'Falha ao criar o produto', {
            buttonText: 'Entendido'
          });
        }
      }
      console.log("Closing product-modal");
      closeModal('product-modal');
      e.target.dataset.productId = ''; // Reset productId
      console.log("Reset form dataset.productId");
    } catch (error) {
      console.error("Error in form submission:", error.message, error.stack);
      showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o produto', {
        buttonText: 'Entendido'
      });
    }
  });

  // Search and filter functionality
  const searchInput = document.getElementById('product-search');
  const statusFilter = document.getElementById('product-status-filter');
  const categoryFilter = document.getElementById('product-category-filter');
  console.log("Search and filter elements:", { searchInput, statusFilter, categoryFilter });

  function filterProducts() {
    console.log("filterProducts called");
    if (!searchInput || !statusFilter || !categoryFilter) {
      console.error("filterProducts: One or more filter elements not found");
      return;
    }

    const search = searchInput.value.toLowerCase().trim();
    const statusFilterValue = statusFilter.value;
    const categoryFilterValue = categoryFilter.value;
    console.log("Filter parameters:", { search, statusFilterValue, categoryFilterValue });

    const filteredProducts = productsData.filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes(search);
      const matchesStatus = statusFilterValue === 'all' ||
                           (statusFilterValue === 'active' && product.status) ||
                           (statusFilterValue === 'inactive' && !product.status);
      const matchesCategory = categoryFilterValue === 'all' ||
                             (product.category || '').toLowerCase() === categoryFilterValue.toLowerCase();
      console.log("Filtering product:", product, { matchesSearch, matchesStatus, matchesCategory });
      return matchesSearch && matchesStatus && matchesCategory;
    });
    console.log("Filtered products:", filteredProducts);
    populateProductsTable(filteredProducts);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      console.log("Search input changed:", searchInput.value);
      filterProducts();
    });
  } else {
    console.error("searchInput not found");
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      console.log("Status filter changed:", statusFilter.value);
      filterProducts();
    });
  } else {
    console.error("statusFilter not found");
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      console.log("Category filter changed:", categoryFilter.value);
      filterProducts();
    });
  } else {
    console.error("categoryFilter not found");
  }

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
    console.log("showConfirmModal called with message:", message, "action:", action);
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    
    if (!modal || !messageElement) {
      console.error("showConfirmModal: Modal or message element not found");
      return;
    }
    
    messageElement.textContent = message;
    messageElement.dataset.action = action;
    console.log("Set confirm message and action");
    modal.classList.add('active');
    console.log("Activated confirm modal");
  }
});
