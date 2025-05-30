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

  // Open add user modal
  window.openAddUserModal = function() {
      const modal = document.getElementById('user-modal');
      const form = document.getElementById('user-form');
      const title = document.getElementById('modal-title');
      
      title.textContent = 'Adicionar Usuário';
      form.reset();
      modal.classList.add('active');
  };

  // Edit user
  window.editUser = function(userId) {
      const modal = document.getElementById('user-modal');
      const form = document.getElementById('user-form');
      const title = document.getElementById('modal-title');
      
      // Simulate fetching user data (replace with API call)
      const userData = {
          1: { name: 'Ana Silva', email: 'ana.silva@peledouro.com', role: 'client', status: 'active' },
          2: { name: 'Carlos Mendes', email: 'carlos.mendes@peledouro.com', role: 'staff', status: 'active' },
          3: { name: 'Maria Costa', email: 'maria.costa@peledouro.com', role: 'admin', status: 'inactive' }
      };

      const user = userData[userId];
      if (user) {
          title.textContent = 'Editar Usuário';
          document.getElementById('user-name').value = user.name;
          document.getElementById('user-email').value = user.email;
          document.getElementById('user-role').value = user.role;
          document.getElementById('user-status').value = user.status;
          modal.classList.add('active');
      }
  };

  // Delete user
  window.deleteUser = function(userId) {
      showConfirmModal(`Tem certeza que deseja excluir o usuário ${userId}?`, `deleteUser-${userId}`);
  };

  // Form submission
  document.getElementById('user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const role = document.getElementById('user-role').value;
      const status = document.getElementById('user-status').value;

      if (!name || !email) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          alert('Por favor, insira um e-mail válido.');
          return;
      }

      // Simulate saving user (replace with API call)
      console.log('Saving user:', { name, email, role, status });
      closeModal('user-modal');
      alert('Usuário salvo com sucesso!');
  });

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
  }

  // Search and filter functionality
  document.getElementById('user-search').addEventListener('input', filterUsers);
  document.getElementById('user-role-filter').addEventListener('change', filterUsers);
  document.getElementById('user-status-filter').addEventListener('change', filterUsers);

  function filterUsers() {
      const search = document.getElementById('user-search').value.toLowerCase();
      const roleFilter = document.getElementById('user-role-filter').value;
      const statusFilter = document.getElementById('user-status-filter').value;

      const rows = document.querySelectorAll('.users-table tbody tr');

      rows.forEach(row => {
          const name = row.cells[0].textContent.toLowerCase();
          const email = row.cells[1].textContent.toLowerCase();
          const role = row.cells[2].textContent.toLowerCase();
          const status = row.cells[3].textContent.toLowerCase();

          const matchesSearch = name.includes(search) || email.includes(search);
          const matchesRole = roleFilter === 'all' || role === roleFilter;
          const matchesStatus = statusFilter === 'all' || status === statusFilter;

          row.style.display = matchesSearch && matchesRole && matchesStatus ? '' : 'none';
      });
  }
});