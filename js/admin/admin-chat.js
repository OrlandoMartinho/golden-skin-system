let currentChatId = null; // Track the currently selected chat
let accessToken = localStorage.getItem('accessToken') || ''; // Assumes token is stored in localStorage

/**
 * Formata uma data/timestamp para exibição no chat
 * @param {string|Date} date - Data a ser formatada (pode ser string ISO ou objeto Date)
 * @returns {string} Data formatada em formato amigável
 */
function formatDate(date) {
  // Se for string, converte para objeto Date
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(messageDate)) return 'Data inválida';
  const now = new Date();

  // Diferença em milissegundos
  const diff = now - messageDate;

  // Se for hoje, mostra apenas a hora
  if (isSameDay(messageDate, now)) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Se for ontem
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(messageDate, yesterday)) {
    return 'Ontem';
  }

  // Se for na mesma semana (últimos 7 dias)
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (messageDate > oneWeekAgo) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }

  // Mais de uma semana atrás - mostra data completa
  return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Verifica se duas datas são no mesmo dia
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

// Funções de modal (placeholders, substitua pelas suas implementações reais)
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

function updateNotifications(message) {
  console.log('Notificação:', message); // Substitua por sua lógica de notificações
}

async function initializeChats() {

  try {
    const status = await getAllChats(accessToken);
    if (status === 200) {
      let chats = JSON.parse(localStorage.getItem('chats') || '[]');
      
 

      const sortedChats = chats.sort((a, b) => {
        return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
      });
    
      const chatList = document.querySelector('.chat-list');
      if (!chatList) throw new Error('Elemento .chat-list não encontrado');

      chatList.innerHTML = '';
      sortedChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.status === 'closed' ? 'closed' : ''}`;
        chatItem.setAttribute('data-chat-id', chat.idChat);

        // Determina o avatar (imagem ou ícone FontAwesome)
        const avatar = chat.userImage1 
          ? `<img src="${chat.userImage1}" alt="Avatar" class="user-avatar">`
          : `<i class="fas fa-user user-avatar"></i>`; // Usa FontAwesome se não houver imagem

        // Sanitiza a última mensagem para evitar XSS
        const lastMessage = chat.lastMessage && chat.lastMessage.length > 0
          ? chat.lastMessage
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .slice(0, 25) + '...'
          : 'Nenhuma mensagem ainda';

        chatItem.innerHTML = `
          <div class="chat-item-info">
            <div class="chat-user-header">
              ${avatar}
              <p class="chat-user-name">${chat.userName1 || 'Usuário'}</p>
            </div>
            <div class="chat-preview">
              <p class="last-message">${lastMessage}</p>
              <div class="chat-meta">
                <small class="last-time">${formatDate(chat.lastMessageTime || chat.createdIn)}</small>
                ${chat.unread > 0 ? `<span class="unread-count">${chat.unread}</span>` : ''}
              </div>
            </div>
          </div>
        `;
        chatItem.addEventListener('click', () => selectChat(chat.idChat));
        chatList.appendChild(chatItem);
      });

      // Select the first chat by default (que agora será o mais recente)
      if (sortedChats.length > 0) {
        selectChat(chats[0].idChat);
      } else {
        document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
        document.getElementById('chat-messages').innerHTML = '<p>Nenhum chat disponível.</p>';
      }
    } else {
      console.warn("Failed to fetch chats, status:", status);
      document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar chats.</p>';
    }
  } catch (error) {
    console.error("Error initializing chats:", error.message, error.stack);
    document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar chats.</p>';
  }
}

async function selectChat(chatId) {
  console.log("Selecting chat:", chatId);
  currentChatId = chatId;

  // Update UI
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('active');
  });
  const chatItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
  if (chatItem) {
    chatItem.classList.add('active');
  }

  // Fetch chat details
  try {
    const status = await getChat(accessToken, chatId);
    if (status === 200) {
      const chat = JSON.parse(localStorage.getItem('chat') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const idUser = user.idUser || 0;

      // Determina o nome do usuário do chat (idUser2 é o destinatário)
      const chatUserName = chat.userName2 || chat.idUser2 || 'Chat sem nome';
      document.getElementById('chat-user-name').textContent = chatUserName;

      // Fetch messages for the chat
      const messagesStatus = await getAllMessages(accessToken, chatId);
      if (messagesStatus === 200) {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = ''; // Clear existing messages

        messages.forEach(msg => {
          const messageDiv = document.createElement('div');
          // Compara o idUser da mensagem com o idUser do usuário logado
          messageDiv.className = `message ${msg.idUser === idUser ? 'sent' : 'received'}`;
          messageDiv.innerHTML = `<p>${msg.description}</p><small>${new Date(msg.createdIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>`;
          chatMessages.appendChild(messageDiv);
        });

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar mensagens.</p>';
      }
    } else {
      document.getElementById('chat-user-name').textContent = 'Novidades';
      document.getElementById('chat-messages').innerHTML = '<p>Chat não encontrado.</p>';
    }
  } catch (error) {
    console.error("Error selecting chat:", error.message, error.stack);
    document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar chat.</p>';
  }
}

async function sendMessage() {
  const input = document.getElementById('chat-message-input');
  const messageText = input.value.trim();

  if (messageText && currentChatId) {
    try {
      const messageData = {
        idChat: currentChatId,
        description: messageText
      };

      const status = await registerMessage(accessToken, messageData);
      if (status === 200) {
        // Refresh messages
        const messagesStatus = await getAllMessages(accessToken, currentChatId);
        if (messagesStatus === 200) {
          const messages = JSON.parse(localStorage.getItem('messages') || '[]');
          const chatMessages = document.getElementById('chat-messages');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const idUser = user.idUser || 0;

          // Preserve scroll position
          const wasScrolledToBottom = chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + 1;

          // Clear and recreate messages
          chatMessages.innerHTML = '';
          messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.idUser === idUser ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `<p>${msg.description}</p><small>${new Date(msg.createdIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>`;
            chatMessages.appendChild(messageDiv);
          });

          // Clear input
          input.value = '';

          // Scroll to bottom if it was already at bottom
          if (wasScrolledToBottom) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        }
        await initializeChats(); // Refresh chat list
      } else {
        console.warn("Failed to send message, status:", status);
      }
    } catch (error) {
      console.error("Error sending message:", error.message, error.stack);
    }
  }
}

async function closeChat() {
  if (currentChatId) {
    const chat = JSON.parse(localStorage.getItem('chat') || '{}');
    document.getElementById('close-chat-message').textContent = `Tem certeza que deseja fechar o chat com ${chat.userName2 || chat.idUser2 || 'Usuário'}?`;
    openModal('close-chat-modal');
  }
}

async function confirmCloseChat() {
  if (currentChatId) {
    try {
      const chatData = {
        idChat: currentChatId,
        status: 'closed'
      };
      const status = await updateChat(accessToken, chatData);
      if (status === 200) {
        // Update UI
        const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
        if (chatItem) {
          chatItem.classList.add('closed');
          const unreadSpan = chatItem.querySelector('.unread-count');
          if (unreadSpan) unreadSpan.remove();
        }

        const chat = JSON.parse(localStorage.getItem('chat') || '{}');
        updateNotifications(`Chat com ${chat.userName2 || chat.idUser2 || 'Usuário'} fechado`);
        await initializeChats();
      } else {
        console.warn("Failed to close chat, status:", status);
      }
    } catch (error) {
      console.error("Error closing chat:", error.message, error.stack);
    }
    closeModal('close-chat-modal');
  }
}

async function deleteChat() {
  if (currentChatId) {
    const chat = JSON.parse(localStorage.getItem('chat') || '{}');
    document.getElementById('delete-chat-message').textContent = `Tem certeza que deseja excluir o chat com ${chat.userName2 || chat.idUser2 || 'Usuário'}? Esta ação é irreversível.`;
    openModal('delete-chat-modal');
  }
}

async function confirmDeleteChat() {
  if (currentChatId) {
    try {
      const status = await deleteChat(accessToken, currentChatId);
      if (status === 200) {
        // Remove chat from localStorage
        let chats = JSON.parse(localStorage.getItem('chats') || '[]');
        chats = chats.filter(chat => chat.idChat !== currentChatId);
        localStorage.setItem('chats', JSON.stringify(chats));

        // Remove chat from UI
        const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
        if (chatItem) chatItem.remove();

        const chat = JSON.parse(localStorage.getItem('chat') || '{}');
        updateNotifications(`Chat com ${chat.userName2 || chat.idUser2 || 'Usuário'} excluído`);

        // Select another chat or clear window
        if (chats.length > 0) {
          selectChat(chats[0].idChat);
        } else {
          currentChatId = null;
          document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
          document.getElementById('chat-messages').innerHTML = '<p>Nenhum chat disponível.</p>';
        }
      } else {
        console.warn("Failed to delete chat, status:", status);
      }
    } catch (error) {
      console.error("Error deleting chat:", error.message, error.stack);
    }
    closeModal('delete-chat-modal');
  }
}

// Initialize chats on page load
document.addEventListener('DOMContentLoaded', initializeChats);