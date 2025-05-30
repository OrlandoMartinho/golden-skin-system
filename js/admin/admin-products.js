document.addEventListener('DOMContentLoaded', () => {
  // Modal control functions
  window.closeModal = function(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.remove('active');
  };

  window.confirmAction = function() {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      console.log('Action confirmed:', messageElement.dataset.action);
      modal.classList.remove('active');
      alert('Ação realizada com sucesso!');
  };

  // Open add product modal
  window.openAddProductModal = function() {
      const modal = document.getElementById('product-modal');
      const form = document.getElementById('product-form');
      const title = document.getElementById('modal-title');
      
      title.textContent = 'Adicionar Produto';
      form.reset();
      modal.classList.add('active');
  };

  // Edit product
  window.editProduct = function(productId) {
      const modal = document.getElementById('product-modal');
      const form = document.getElementById('product-form');
      const title = document.getElementById('modal-title');
      
      // Simulate fetching product data (replace with API call)
      const productData = {
          1: { name: 'Creme Hidratante', category: 'skincare', price: 59.90, stock: 50, status: 'active' },
          2: { name: 'Óleo Corporal Natural', category: 'body', price: 39.90, stock: 100, status: 'active' },
          3: { name: 'Kit Spa Completo', category: 'kits', price: 189.90, stock: 20, status: 'inactive' }
      };

      const product = productData[productId];
      if (product) {
          title.textContent = 'Editar Produto';
          document.getElementById('product-name').value = product.name;
          document.getElementById('product-category').value = product.category;
          document.getElementById('product-price').value = product.price;
          document.getElementById('product-stock').value = product.stock;
          document.getElementById('product-status').value = product.status;
          modal.classList.add('active');
      }
  };

  // Delete product
  window.deleteProduct = function(productId) {
      showConfirmModal(`Tem certeza que deseja excluir o produto ${productId}?`, `deleteProduct-${productId}`);
  };

  // Form submission
  document.getElementById('product-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('product-name').value.trim();
      const category = document.getElementById('product-category').value;
      const price = parseFloat(document.getElementById('product-price').value);
      const stock = parseInt(document.getElementById('product-stock').value);
      const status = document.getElementById('product-status').value;

      if (!name || !category || isNaN(price) || isNaN(stock)) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
      }

      if (price < 0) {
          alert('O preço não pode ser negativo.');
          return;
      }

      if (stock < 0) {
          alert('O estoque não pode ser negativo.');
          return;
      }

      // Simulate saving product (replace with API call)
      console.log('Saving product:', { name, category, price, stock, status });
      closeModal('product-modal');
      alert('Produto salvo com sucesso!');
  });

  // Search and filter functionality
  document.getElementById('product-search').addEventListener('input', filterProducts);
  document.getElementById('product-status-filter').addEventListener('change', filterProducts);
  document.getElementById('product-category-filter').addEventListener('change', filterProducts);

  function filterProducts() {
      const search = document.getElementById('product-search').value.toLowerCase();
      const statusFilter = document.getElementById('product-status-filter').value;
      const categoryFilter = document.getElementById('product-category-filter').value;

      const rows = document.querySelectorAll('.products-table tbody tr');

      rows.forEach(row => {
          const name = row.cells[0].textContent.toLowerCase();
          const category = row.cells[1].textContent.toLowerCase();
          const status = row.cells[4].textContent.toLowerCase();

          const matchesSearch = name.includes(search);
          const matchesStatus = statusFilter === 'all' || status === statusFilter;
          const matchesCategory = categoryFilter === 'all' || category === categoryFilter;

          row.style.display = matchesSearch && matchesStatus && matchesCategory ? '' : 'none';
      });
  }

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
  }
});