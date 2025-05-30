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

  // Simulated chat data
  const chats = {
      1: {
          user: 'Ana Silva',
          messages: [
              { type: 'received', text: 'Olá, gostaria de saber sobre a disponibilidade de massagem relaxante.', time: '14:25' },
              { type: 'sent', text: 'Olá, Ana! Temos horários disponíveis amanhã às 10h e 14h. Qual prefere?', time: '14:28' },
              { type: 'received', text: '14h seria ótimo! Como faço para reservar?', time: '14:30' }
          ],
          status: 'open',
          unread: 2
      },
      2: {
          user: 'Carlos Mendes',
          messages: [
              { type: 'received', text: 'Qual o prazo de entrega do kit spa?', time: '10:15' },
              { type: 'sent', text: 'Oi, Carlos! O prazo é de 3 a 5 dias úteis.', time: '10:20' }
          ],
          status: 'open',
          unread: 0
      },
      3: {
          user: 'Maria Costa',
          messages: [
              { type: 'received', text: 'Preciso reagendar meu horário.', time: '16:00' }
          ],
          status: 'open',
          unread: 1
      }
  };

  // Select chat
  window.selectChat = function(chatId) {
      const chat = chats[chatId];
      if (!chat) return;

      // Update active chat item
      document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
      document.querySelector(`.chat-item[onclick="selectChat(${chatId})"]`).classList.add('active');

      // Update chat window
      document.getElementById('chat-user-name').textContent = chat.user;
      const messagesContainer = document.getElementById('chat-messages');
      messagesContainer.innerHTML = '';
      chat.messages.forEach(msg => {
          const msgDiv = document.createElement('div');
          msgDiv.className = `message ${msg.type}`;
          msgDiv.innerHTML = `<p>${msg.text}</p><small>${msg.time}</small>`;
          messagesContainer.appendChild(msgDiv);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  // Send message
  window.sendMessage = function() {
      const input = document.getElementById('chat-message-input');
      const text = input.value.trim();
      if (!text) return;

      // Simulate sending message (replace with API call)
      const activeChatItem = document.querySelector('.chat-item.active');
      const chatId = activeChatItem ? parseInt(activeChatItem.getAttribute('onclick').match(/\d+/)[0]) : null;
      if (chatId && chats[chatId]) {
          const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          chats[chatId].messages.push({ type: 'sent', text, time });

          // Update chat window
          const messagesContainer = document.getElementById('chat-messages');
          const msgDiv = document.createElement('div');
          msgDiv.className = 'message sent';
          msgDiv.innerHTML = `<p>${text}</p><small>${time}</small>`;
          messagesContainer.appendChild(msgDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          // Update chat list preview
          const chatItem = activeChatItem.querySelector('.chat-item-info p');
          chatItem.textContent = `Última mensagem: ${text.slice(0, 20)}${text.length > 20 ? '...' : ''}`;
          activeChatItem.querySelector('.chat-item-info small').textContent = `Hoje, ${time}`;

          input.value = '';
      }
  };

  // Close chat
  window.closeChat = function() {
      const activeChatItem = document.querySelector('.chat-item.active');
      const chatId = activeChatItem ? parseInt(activeChatItem.getAttribute('onclick').match(/\d+/)[0]) : null;
      if (chatId) {
          showConfirmModal(`Deseja fechar o chat com ${chats[chatId].user}?`, `closeChat-${chatId}`);
      }
  };

  // Delete chat
  window.deleteChat = function() {
      const activeChatItem = document.querySelector('.chat-item.active');
      const chatId = activeChatItem ? parseInt(activeChatItem.getAttribute('onclick').match(/\d+/)[0]) : null;
      if (chatId) {
          showConfirmModal(`Deseja excluir o chat com ${chats[chatId].user}?`, `deleteChat-${chatId}`);
      }
  };

  // Search and filter chats
  document.getElementById('chat-search').addEventListener('input', filterChats);
  document.getElementById('chat-status-filter').addEventListener('change', filterChats);

  function filterChats() {
      const search = document.getElementById('chat-search').value.toLowerCase();
      const statusFilter = document.getElementById('chat-status-filter').value;

      document.querySelectorAll('.chat-item').forEach(item => {
          const chatId = parseInt(item.getAttribute('onclick').match(/\d+/)[0]);
          const chat = chats[chatId];
          const user = chat.user.toLowerCase();
          const matchesSearch = user.includes(search);
          const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;

          item.style.display = matchesSearch && matchesStatus ? '' : 'none';
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

  // Initialize with first chat selected
  selectChat(1);
});