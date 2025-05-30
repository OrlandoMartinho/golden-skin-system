let currentChatId = 1; // Track the currently selected chat

// Mock chat data
const chatData = {
  1: {
    name: 'Ana Silva',
    messages: [
      { type: 'received', text: 'Olá, gostaria de saber sobre a disponibilidade de massagem relaxante.', time: '14:25' },
      { type: 'sent', text: 'Olá, Ana! Temos horários disponíveis amanhã às 10h e 14h. Qual prefere?', time: '14:28' },
      { type: 'received', text: '14h seria ótimo! Como faço para reservar?', time: '14:30' }
    ],
    status: 'open',
    unread: 2
  },
  2: {
    name: 'Carlos Mendes',
    messages: [
      { type: 'received', text: 'Qual o prazo de entrega do produto X?', time: '10:15' },
      { type: 'sent', text: 'O prazo de entrega é de 3 a 5 dias úteis.', time: '10:20' }
    ],
    status: 'open',
    unread: 0
  },
  3: {
    name: 'Maria Costa',
    messages: [
      { type: 'received', text: 'Preciso reagendar meu horário.', time: '16:00' },
      { type: 'sent', text: 'Claro, Maria! Qual horário seria mais conveniente?', time: '16:05' }
    ],
    status: 'open',
    unread: 1
  }
};

function selectChat(chatId) {
  // Update current chat ID
  currentChatId = chatId;

  // Remove active class from all chat items
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('active');
  });

  // Add active class to selected chat item
  const chatItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
  if (chatItem) {
    chatItem.classList.add('active');
  }

  // Update chat window header and messages
  const userName = chatData[chatId]?.name || 'Nenhum chat selecionado';
  document.getElementById('chat-user-name').textContent = userName;

  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = ''; // Clear existing messages

  if (chatData[chatId]) {
    chatData[chatId].messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.type}`;
      messageDiv.innerHTML = `<p>${msg.text}</p><small>${msg.time}</small>`;
      chatMessages.appendChild(messageDiv);
    });

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } else {
    chatMessages.innerHTML = '<p>Nenhum chat disponível.</p>';
  }
}

function sendMessage() {
  const input = document.getElementById('chat-message-input');
  const messageText = input.value.trim();

  if (messageText && chatData[currentChatId]) {
    const chatMessages = document.getElementById('chat-messages');
    const newMessage = {
      type: 'sent',
      text: messageText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // Add message to chat data
    chatData[currentChatId].messages.push(newMessage);

    // Append message to UI
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `<p>${messageText}</p><small>${newMessage.time}</small>`;
    chatMessages.appendChild(messageDiv);

    // Clear input
    input.value = '';

    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Update notifications
    updateNotifications(`Nova mensagem enviada para ${chatData[currentChatId].name}`);
  }
}

function closeChat() {
  if (chatData[currentChatId]) {
    document.getElementById('close-chat-message').textContent = `Tem certeza que deseja fechar o chat com ${chatData[currentChatId].name}?`;
    openModal('close-chat-modal');
  }
}

function confirmCloseChat() {
  if (chatData[currentChatId]) {
    // Mark chat as closed
    chatData[currentChatId].status = 'closed';
    chatData[currentChatId].unread = 0; // Clear unread count

    // Update UI
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
    if (chatItem) {
      chatItem.classList.add('closed');
      const unreadSpan = chatItem.querySelector('.unread-count');
      if (unreadSpan) {
        unreadSpan.remove();
      }
    }

    // Update notifications
    updateNotifications(`Chat com ${chatData[currentChatId].name} fechado`);

    // Close modal
    closeModal('close-chat-modal');
  }
}

function deleteChat() {
  if (chatData[currentChatId]) {
    document.getElementById('delete-chat-message').textContent = `Tem certeza que deseja excluir o chat com ${chatData[currentChatId].name}? Esta ação é irreversível.`;
    openModal('delete-chat-modal');
  }
}

function confirmDeleteChat() {
  if (chatData[currentChatId]) {
    // Remove chat from UI
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
    if (chatItem) {
      chatItem.remove();
    }

    // Update notifications
    updateNotifications(`Chat com ${chatData[currentChatId].name} excluído`);

    // Remove chat from data
    delete chatData[currentChatId];

    // Select another chat or clear window
    const remainingChats = document.querySelectorAll('.chat-item');
    if (remainingChats.length > 0) {
      const newChatId = remainingChats[0].getAttribute('data-chat-id');
      selectChat(newChatId);
    } else {
      currentChatId = null;
      document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
      document.getElementById('chat-messages').innerHTML = '<p>Nenhum chat disponível.</p>';
    }

    // Close modal
    closeModal('delete-chat-modal');
  }
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function updateNotifications(message) {
  const notifications = document.querySelector('.notifications-dropdown');
  const notificationItem = document.createElement('div');
  notificationItem.className = 'notification-item';
  notificationItem.innerHTML = `
    <i class="far fa-comments"></i>
    <div>
      <p>${message}</p>
      <small>${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>
    </div>
  `;
  notifications.prepend(notificationItem);

  // Update notification badge
  const badge = document.querySelector('.notification-badge');
  badge.textContent = parseInt(badge.textContent) + 1;
}

// Initialize first chat
document.addEventListener('DOMContentLoaded', () => {
  selectChat(1);
});