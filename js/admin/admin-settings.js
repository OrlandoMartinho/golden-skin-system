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
      alert('Alteração salva com sucesso!');
  };

  // Tab switching
  document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');
          
          // Update active tab
          document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Update active content
          document.querySelectorAll('.settings-content').forEach(content => content.classList.remove('active'));
          document.getElementById(`${tabId}-tab`).classList.add('active');
      });
  });

  // Photo preview
  window.previewPhoto = function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              document.getElementById('profile-photo-preview').src = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  };

  // Save name
  window.saveName = function() {
      const name = document.getElementById('admin-name').value.trim();
      if (!name) {
          alert('Por favor, digite um nome válido.');
          return;
      }
      showConfirmModal('Deseja salvar o novo nome?', 'saveName');
  };

  // Save phone
  window.savePhone = function() {
      const phone = document.getElementById('admin-phone').value.trim();
      if (!phone.match(/^\+\d{2}\s\d{2}\s\d{5}-\d{4}$/)) {
          alert('Por favor, digite um número de telefone válido (ex: +55 11 98765-4321).');
          return;
      }
      showConfirmModal('Deseja salvar o novo número de telefone?', 'savePhone');
  };

  // Upload photo
  window.uploadPhoto = function() {
      const fileInput = document.getElementById('admin-photo');
      if (!fileInput.files.length) {
          alert('Por favor, selecione uma imagem.');
          return;
      }
      showConfirmModal('Deseja atualizar a foto de perfil?', 'uploadPhoto');
  };

  // Save email
  window.saveEmail = function() {
      const email = document.getElementById('admin-email').value.trim();
      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          alert('Por favor, digite um e-mail válido.');
          return;
      }
      showConfirmModal('Deseja salvar o novo e-mail?', 'saveEmail');
  };

  // Save password
  window.savePassword = function() {
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (!currentPassword || !newPassword || !confirmPassword) {
          alert('Por favor, preencha todos os campos de senha.');
          return;
      }

      if (newPassword !== confirmPassword) {
          alert('As novas senhas não coincidem.');
          return;
      }

      if (newPassword.length < 8) {
          alert('A nova senha deve ter pelo menos 8 caracteres.');
          return;
      }

      showConfirmModal('Deseja salvar a nova senha?', 'savePassword');
  };

  // Save clinic name
  window.saveClinicName = function() {
      const clinicName = document.getElementById('clinic-name').value.trim();
      if (!clinicName) {
          alert('Por favor, digite um nome válido para a clínica.');
          return;
      }
      showConfirmModal('Deseja salvar o novo nome da clínica?', 'saveClinicName');
  };

  // Save clinic address
  window.saveClinicAddress = function() {
      const address = document.getElementById('clinic-address').value.trim();
      if (!address) {
          alert('Por favor, digite um endereço válido.');
          return;
      }
      showConfirmModal('Deseja salvar o novo endereço da clínica?', 'saveClinicAddress');
  };

  // Save notification settings
  window.saveNotificationSettings = function() {
      const notifyEmail = document.getElementById('notify-email').checked;
      const notifySMS = document.getElementById('notify-sms').checked;
      console.log('Notification settings:', { notifyEmail, notifySMS });
      showConfirmModal('Deseja salvar as configurações de notificações?', 'saveNotificationSettings');
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