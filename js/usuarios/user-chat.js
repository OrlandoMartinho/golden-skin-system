document.addEventListener('DOMContentLoaded', async () => {
  const accessToken = localStorage.getItem('accessToken'); // Supondo que o token esteja armazenado no localStorage
  const api_host = 'https://your-api-url.com'; // Substitua pela URL real da API
  let currentChatId = null;

  // Função para formatar datas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Função para carregar chats
  async function loadChats() {
    const response = await getAllChats(accessToken);
    const chatList = document.querySelector('.chat-list-items');
    chatList.innerHTML = ''; // Limpa a lista

    if (response === 200) {
      const chats = JSON.parse(localStorage.getItem('chats')) || [];
      if (chats.length === 0) {
        chatList.innerHTML = `
          <div class="no-chats">
            <i class="fas fa-comments"></i>
            <p>Nenhuma conversa encontrada</p>
          </div>`;
        return;
      }

      chats.forEach(chat => {
        const item = document.createElement('div');
        item.classList.add('chat-item');
        item.dataset.id = chat.idChat;
        item.innerHTML = `
          <img src="${chat.userPhoto2 || '../../assets/img/avatar.svg'}" alt="Foto do usuário" class="chat-avatar">
          <div class="chat-info">
            <h3>${chat.userName2}</h3>
            <p>${chat.lastMessage || 'Nenhuma mensagem'}</p>
            <small>${formatDate(chat.lastMessageDate)}</small>
          </div>
        `;
        item.addEventListener('click', () => selectChat(chat.idChat, chat.userName2));
        chatList.appendChild(item);
      });
    } else {
      chatList.innerHTML = `
        <div class="no-chats">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Erro ao carregar conversas</p>
        </div>`;
    }
  }

  // Função para selecionar um chat e carregar mensagens
  async function selectChat(idChat, userName) {
    currentChatId = idChat;
    const chatTitle = document.getElementById('chat-title');
    const messagesContainer = document.querySelector('.messages-container');
    const deleteChatButton = document.querySelector('.delete-chat');

    chatTitle.textContent = `Conversa com ${userName}`;
    deleteChatButton.style.display = 'block';
    messagesContainer.innerHTML = '';

    const response = await getChat(accessToken, idChat);
    if (response === 200) {
      const chat = JSON.parse(localStorage.getItem('chat'));
      const messages = chat.Messages || [];
      if (messages.length === 0) {
        messagesContainer.innerHTML = `
          <div class="no-messages">
            <p>Nenhuma mensagem nesta conversa</p>
          </div>`;
        return;
      }

      messages.forEach(message => {
        const isSentByUser = message.idUser === chat.idUser;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isSentByUser ? 'sent' : 'received');
        messageElement.innerHTML = `
          <p>${message.description}</p>
          <small>${formatDate(message.createdIn)}</small>
        `;
        messagesContainer.appendChild(messageElement);
      });

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
      messagesContainer.innerHTML = `
        <div class="no-messages">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Erro ao carregar mensagens</p>
        </div>`;
    }
  }

  // Função para enviar mensagem
  async function sendMessage() {
    const messageText = document.getElementById('message-text').value.trim();
    if (!currentChatId || !messageText) return;

    const messageData = {
      idChat: currentChatId,
      description: messageText
    };

    const response = await registerMessage(accessToken, messageData);
    if (response === 200) {
      document.getElementById('message-text').value = '';
      await selectChat(currentChatId, document.getElementById('chat-title').textContent.replace('Conversa com ', '')); // Recarrega mensagens
      await loadChats(); // Atualiza lista de chats
    } else {
      alert('Erro ao enviar mensagem');
    }
  }

  // Função para excluir chat
  async function deleteSelectedChat() {
    if (!currentChatId) return;

    const response = await deleteChat(accessToken, currentChatId);
    if (response === 200) {
      currentChatId = null;
      document.getElementById('chat-title').textContent = 'Selecione uma conversa';
      document.querySelector('.delete-chat').style.display = 'none';
      document.querySelector('.messages-container').innerHTML = '';
      await loadChats();
    } else {
      alert('Erro ao excluir conversa');
    }
  }

  // Função para filtrar chats
  function filterChats() {
    const searchValue = document.getElementById('chat-search').value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');

    chatItems.forEach(item => {
      const userName = item.querySelector('h3').textContent.toLowerCase();
      item.style.display = userName.includes(searchValue) ? 'flex' : 'none';
    });
  }

  // Inicializar carregamento
  await loadChats();

  // Event listeners
  document.getElementById('chat-search').addEventListener('input', filterChats);
  document.getElementById('send-message').addEventListener('click', sendMessage);
  document.querySelector('.delete-chat').addEventListener('click', deleteSelectedChat);
});