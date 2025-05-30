document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.settings-tab');
  const contents = document.querySelectorAll('.settings-content');

  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');

          // Remove active class from all tabs and contents
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));

          // Add active class to clicked tab and corresponding content
          tab.classList.add('active');
          document.getElementById(`${tabId}-tab`).classList.add('active');
      });
  });

  // Modal control functions
  window.closeModal = function(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.remove('active');
  };

  window.confirmAction = function() {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      // Simulate saving changes (replace with actual API call)
      console.log('Changes confirmed:', messageElement.dataset.action);
      modal.classList.remove('active');
      
      // Show success message (could be replaced with a toast notification)
      alert('Alterações salvas com sucesso!');
  };

  // Form validation and saving functions
  window.saveName = function() {
      const nameInput = document.getElementById('user-name');
      const name = nameInput.value.trim();

      if (!name) {
          alert('Por favor, insira um nome válido.');
          return;
      }

      if (name.length < 2) {
          alert('O nome deve ter pelo menos 2 caracteres.');
          return;
      }

      // Show confirmation modal
      showConfirmModal('Tem certeza que deseja salvar o novo nome?', 'saveName');
  };

  window.savePhone = function() {
      const phoneInput = document.getElementById('user-phone');
      const phone = phoneInput.value.trim();
      const phoneRegex = /^\+?\d{10,15}$/;

      if (!phone) {
          alert('Por favor, insira um número de telefone.');
          return;
      }

      if (!phoneRegex.test(phone)) {
          alert('Por favor, insira um número de telefone válido (ex.: +5511987654321).');
          return;
      }

      // Show confirmation modal
      showConfirmModal('Tem certeza que deseja salvar o novo número de telefone?', 'savePhone');
  };

  window.saveEmail = function() {
      const emailInput = document.getElementById('user-email');
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
          alert('Por favor, insira um e-mail.');
          return;
      }

      if (!emailRegex.test(email)) {
          alert('Por favor, insira um e-mail válido.');
          return;
      }

      // Show confirmation modal
      showConfirmModal('Tem certeza que deseja salvar o novo e-mail?', 'saveEmail');
  };

  window.savePassword = function() {
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (!currentPassword || !newPassword || !confirmPassword) {
          alert('Por favor, preencha todos os campos de senha.');
          return;
      }

      if (newPassword.length < 8) {
          alert('A nova senha deve ter pelo menos 8 caracteres.');
          return;
      }

      if (newPassword !== confirmPassword) {
          alert('A nova senha e a confirmação não coincidem.');
          return;
      }

      // Show confirmation modal
      showConfirmModal('Tem certeza que deseja alterar a senha?', 'savePassword');
  };

  window.previewPhoto = function(event) {
      const file = event.target.files[0];
      const preview = document.getElementById('profile-photo-preview');

      if (file) {
          if (!file.type.startsWith('image/')) {
              alert('Por favor, selecione um arquivo de imagem válido.');
              return;
          }

          const reader = new FileReader();
          reader.onload = function(e) {
              preview.src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  };

  window.uploadPhoto = function() {
      const photoInput = document.getElementById('user-photo');
      const file = photoInput.files[0];

      if (!file) {
          alert('Por favor, selecione uma foto para atualizar.');
          return;
      }

      // Show confirmation modal
      showConfirmModal('Tem certeza que deseja atualizar a foto de perfil?', 'uploadPhoto');
  };

  // Helper function to show confirmation modal
  function showConfirmModal(message, action) {
      const modal = document.getElementById('confirm-modal');
      const messageElement = document.getElementById('confirm-message');
      
      messageElement.textContent = message;
      messageElement.dataset.action = action;
      modal.classList.add('active');
  }
}); 