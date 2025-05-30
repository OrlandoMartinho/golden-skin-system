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

  // Open add service modal
  window.openAddServiceModal = function() {
      const modal = document.getElementById('service-modal');
      const form = document.getElementById('service-form');
      const title = document.getElementById('modal-title');
      
      title.textContent = 'Adicionar Serviço';
      form.reset();
      modal.classList.add('active');
  };

  // Edit service
  window.editService = function(serviceId) {
      const modal = document.getElementById('service-modal');
      const form = document.getElementById('service-form');
      const title = document.getElementById('modal-title');
      
      // Simulate fetching service data (replace with API call)
      const serviceData = {
          1: { name: 'Massagem Relaxante', category: 'massage', duration: 60, price: 120.00, status: 'active' },
          2: { name: 'Tratamento Facial', category: 'facial', duration: 45, price: 85.00, status: 'active' },
          3: { name: 'Depilação a Laser', category: 'laser', duration: 30, price: 150.00, status: 'inactive' }
      };

      const service = serviceData[serviceId];
      if (service) {
          title.textContent = 'Editar Serviço';
          document.getElementById('service-name').value = service.name;
          document.getElementById('service-category').value = service.category;
          document.getElementById('service-duration').value = service.duration;
          document.getElementById('service-price').value = service.price;
          document.getElementById('service-status').value = service.status;
          modal.classList.add('active');
      }
  };

  // Delete service
  window.deleteService = function(serviceId) {
      showConfirmModal(`Tem certeza que deseja excluir o serviço ${serviceId}?`, `deleteService-${serviceId}`);
  };

  // Form submission
  document.getElementById('service-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('service-name').value.trim();
      const category = document.getElementById('service-category').value;
      const duration = parseInt(document.getElementById('service-duration').value);
      const price = parseFloat(document.getElementById('service-price').value);
      const status = document.getElementById('service-status').value;

      if (!name || !category || !duration || !price) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
      }

      if (duration < 1) {
          alert('A duração deve ser maior que 0 minutos.');
          return;
      }

      if (price < 0) {
          alert('O preço não pode ser negativo.');
          return;
      }

      // Simulate saving service (replace with API call)
      console.log('Saving service:', { name, category, duration, price, status });
      closeModal('service-modal');
      alert('Serviço salvo com sucesso!');
  });

  // Search and filter functionality
  document.getElementById('service-search').addEventListener('input', filterServices);
  document.getElementById('service-status-filter').addEventListener('change', filterServices);
  document.getElementById('service-category-filter').addEventListener('change', filterServices);

  function filterServices() {
      const search = document.getElementById('service-search').value.toLowerCase();
      const statusFilter = document.getElementById('service-status-filter').value;
      const categoryFilter = document.getElementById('service-category-filter').value;

      const rows = document.querySelectorAll('.services-table tbody tr');

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