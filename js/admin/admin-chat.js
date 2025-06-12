// admin-chat.js

// === Estado Global ===
let currentChatId = null; // ID do chat selecionado
const accessToken = localStorage.getItem('accessToken') || ''; // Token de autenticação

// === Funções Utilitárias ===

/**
 * Formata uma data/timestamp para exibição no chat
 * @param {string|Date} date - Data a ser formatada (pode ser string ISO ou objeto Date)
 * @returns {string} Data formatada em formato amigável
 */
function formatDate(date) {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(messageDate)) return 'Data inválida';

  const now = new Date();
  if (isSameDay(messageDate, now)) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(messageDate, yesterday)) {
    return 'Ontem';
  }

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (messageDate > oneWeekAgo) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }

  return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Verifica se duas datas são no mesmo dia
 * @param {Date} date1 - Primeira data
 * @param {Date} date2 - Segunda data
 * @returns {boolean} True se as datas são do mesmo dia
 */
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Sanitiza uma mensagem para evitar XSS
 * @param {string} message - Mensagem a ser sanitizada
 * @param {number} maxLength - Comprimento máximo da mensagem
 * @returns {string} Mensagem sanitizada e truncada
 */
function sanitizeMessage(message, maxLength = 25) {
  if (!message || message.length === 0) return 'Nenhuma mensagem ainda';
  return message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, maxLength) + (message.length > maxLength ? '...' : '');
}

// === Funções de Manipulação de UI ===

/**
 * Abre um modal pelo ID
 * @param {string} modalId - ID do modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

/**
 * Fecha um modal pelo ID
 * @param {string} modalId - ID do modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

/**
 * Exibe uma notificação
 * @param {string} message - Mensagem da notificação
 */
function updateNotifications(message) {
  console.log('Notificação:', message);
  // Implementar lógica de notificação (ex.: atualizar #notification-container)
}

/**
 * Renderiza a lista de chats na UI
 * @param {Array} chats - Lista de chats
 */
function renderChatList(chats) {
  const chatList = document.querySelector('.chat-list');
  if (!chatList) throw new Error('Elemento .chat-list não encontrado');

  chatList.innerHTML = '';
  chats.forEach((chat, index) => {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${chat.status === 'closed' ? 'closed' : ''}`;
    chatItem.setAttribute('data-chat-id', chat.idChat);
    chatItem.setAttribute('data-chat-index', index);

    const avatar = chat.userImage1
      ? `<img src="${chat.userImage1}" alt="Avatar de ${chat.userName1 || 'Usuário'}" class="user-avatar">`
      : `<i class="fas fa-user user-avatar" aria-hidden="true"></i>`;

    const lastMessage = sanitizeMessage(chat.lastMessage);
    chatItem.innerHTML = `
      <div class="chat-item-info" data-chat-index="${index}">
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
}

/**
 * Renderiza as mensagens de um chat na UI
 * @param {Array} messages - Lista de mensagens
 * @param {number} idUser - ID do usuário logado
 */
function renderMessages(messages, idUser) {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';

  messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.idUser === idUser ? 'sent' : 'received'} ${msg.isNew ? 'new' : ''}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${sanitizeMessage(msg.description, Infinity)}</p>
        <small>${new Date(msg.createdIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === Funções de Gerenciamento de Chats ===

/**
 * Inicializa a lista de chats
 */
async function initializeChats() {
  try {
    const status = await getAllChats(accessToken);
    if (status !== 200) {
      console.warn('Falha ao buscar chats, status:', status);
      document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar chats.</p>';
      return;
    }

    const chats = JSON.parse(localStorage.getItem('chats') || '[]').sort(
      (a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate)
    );

    renderChatList(chats);

    if (chats.length > 0) {
      selectChat(chats[0].idChat);
    } else {
      document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
      document.getElementById('chat-messages').innerHTML = '<p>Nenhum chat disponível.</p>';
    }
  } catch (error) {
    console.error('Erro ao inicializar chats:', error.message, error.stack);
    document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar chats.</p>';
  }
}

/**
 * Seleciona um chat e carrega suas mensagens
 * @param {string} chatId - ID do chat
 */
async function selectChat(chatId) {
  console.log('Selecionando chat:', chatId);
  currentChatId = chatId;

  // Depuração: Verificar estado do layout
  console.log('Largura da janela:', window.innerWidth);
  console.log('Classe do dashboard-container:', document.querySelector('.dashboard-container').className);

  // Atualiza UI
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('active');
    console.log('Item removido active:', item.getAttribute('data-chat-id'));
  });
  const chatItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
  if (chatItem) {
    chatItem.classList.add('active');
    console.log('Item selecionado:', chatId, 'Index:', chatItem.getAttribute('data-chat-index'));
  } else {
    console.warn('Item de chat não encontrado:', chatId);
  }

  try {
    const status = await getChat(accessToken, chatId);
    const chat = JSON.parse(localStorage.getItem('chat') || '{}');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const idUser = user.idUser || 0;

    document.getElementById('chat-user-name').textContent = chat.userName2 || chat.idUser2 || 'Chat sem nome';

    const messagesStatus = await getAllMessages(accessToken, chatId);
    if (messagesStatus === 200) {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      renderMessages(messages, idUser);
    } else {
      document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar mensagens.</p>';
    }
  } catch (error) {
    console.error('Erro ao selecionar chat:', error.message, error.stack);
    document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar chat.</p>';
  }
}

/**
 * Envia uma nova mensagem
 */
async function sendMessage() {
  const input = document.getElementById('chat-message-input');
  const messageText = input.value.trim();

  if (!messageText || !currentChatId) return;

  try {
    const messageData = { idChat: currentChatId, description: messageText };
    const status = await registerMessage(accessToken, messageData);

    if (status === 200) {
      const messagesStatus = await getAllMessages(accessToken, currentChatId);
      if (messagesStatus === 200) {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const idUser = user.idUser || 0;

        const chatMessages = document.getElementById('chat-messages');
        const wasScrolledToBottom =
          chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + 1;

        renderMessages(messages, idUser);
        input.value = '';

        if (wasScrolledToBottom) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }
      await initializeChats();
    } else {
      console.warn('Falha ao enviar mensagem, status:', status);
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.message, error.stack);
  }
}

/**
 * Fecha o chat atual
 */
async function closeChat() {
  if (!currentChatId) return;

  const chat = JSON.parse(localStorage.getItem('chat') || '{}');
  document.getElementById('close-chat-message').textContent = `Tem certeza que deseja fechar o chat com ${
    chat.userName2 || chat.idUser2 || 'Usuário'
  }?`;
  openModal('close-chat-modal');
}

/**
 * Confirma o fechamento do chat
 */
async function confirmCloseChat() {
  if (!currentChatId) return;

  try {
    const chatData = { idChat: currentChatId, status: 'closed' };
    const status = await updateChat(accessToken, chatData);

    if (status === 200) {
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
      console.warn('Falha ao fechar chat, status:', status);
    }
  } catch (error) {
    console.error('Erro ao fechar chat:', error.message, error.stack);
  }
  closeModal('close-chat-modal');
}

/**
 * Exclui o chat atual
 */
async function deleteChat() {
  if (!currentChatId) return;

  const chat = JSON.parse(localStorage.getItem('chat') || '{}');
  document.getElementById('delete-chat-message').textContent = `Tem certeza que deseja excluir o chat com ${
    chat.userName2 || chat.idUser2 || 'Usuário'
  }? Esta ação é irreversível.`;
  openModal('delete-chat-modal');
}

/**
 * Confirma a exclusão do chat
 */
async function confirmDeleteChat() {
  if (!currentChatId) return;

  try {
    const status = await deleteChat(accessToken, currentChatId);
    if (status === 200) {
      let chats = JSON.parse(localStorage.getItem('chats') || '[]');
      chats = chats.filter(chat => chat.idChat !== currentChatId);
      localStorage.setItem('chats', JSON.stringify(chats));

      const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
      if (chatItem) chatItem.remove();

      const chat = JSON.parse(localStorage.getItem('chat') || '{}');
      updateNotifications(`Chat com ${chat.userName2 || chat.idUser2 || 'Usuário'} excluído`);

      if (chats.length > 0) {
        selectChat(chats[0].idChat);
      } else {
        currentChatId = null;
        document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
        document.getElementById('chat-messages').innerHTML = '<p>Nenhum chat disponível.</p>';
      }
    } else {
      console.warn('Falha ao excluir chat, status:', status);
    }
  } catch (error) {
    console.error('Erro ao excluir chat:', error.message, error.stack);
  }
  closeModal('delete-chat-modal');
}

// === Funções de Polling ===

/**
 * Verifica se há novas mensagens no chat atual
 */
async function checkForNewMessages() {
  if (!currentChatId) return;

  try {
    const messagesStatus = await getAllMessages(accessToken, currentChatId);
    if (messagesStatus !== 200) {
      console.warn('Erro ao verificar mensagens, status:', messagesStatus);
      return;
    }

    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const currentMessageCount = document.querySelectorAll('#chat-messages .message').length;

    if (messages.length > currentMessageCount) {
      console.log('Novas mensagens detectadas no chat:', currentChatId);
      await selectChat(currentChatId);
      updateNotifications('Nova mensagem recebida');
    }

    await initializeChats();
  } catch (error) {
    console.error('Erro ao verificar novas mensagens:', error.message, error.stack);
  }
}

/**
 * Inicia o polling para novas mensagens
 */
function startMessagePolling() {
  checkForNewMessages();
  setInterval(checkForNewMessages, 5000);
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
  // Controlar modo desktop/móvel
  document.body.classList.toggle('desktop-mode', window.innerWidth > 768);
  window.addEventListener('resize', () => {
    document.body.classList.toggle('desktop-mode', window.innerWidth > 768);
  });

  // Inicializar chats e polling
  initializeChats();
  startMessagePolling();

  // Vincular eventos
  document.getElementById('send-message-btn').addEventListener('click', sendMessage);
  document.getElementById('close-chat-btn').addEventListener('click', closeChat);
  document.getElementById('delete-chat-btn').addEventListener('click', deleteChat);
  document.getElementById('confirm-close-chat-btn').addEventListener('click', confirmCloseChat);
  document.getElementById('confirm-delete-chat-btn').addEventListener('click', confirmDeleteChat);
  document.querySelectorAll('.modal .close, .modal .cancel').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal').id));
  });

  // Depuração para cliques em chat-item
  document.querySelector('.chat-list').addEventListener('click', (e) => {
    const chatItem = e.target.closest('.chat-item');
    if (chatItem) {
      console.log('Chat clicado:', chatItem.getAttribute('data-chat-id'), 'Index:', chatItem.getAttribute('data-chat-index'));
      console.log('Estado do layout:', {
        windowWidth: window.innerWidth,
        dashboardClasses: document.querySelector('.dashboard-container').className,
        bodyClasses: document.body.className
      });
    }
  });
});