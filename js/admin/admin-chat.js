let currentChatId = null; // Track the currently selected chat
let accessToken = localStorage.getItem('accessToken') || ''; // Assumes token is stored in localStorage

// Initialize chats from localStorage or API
async function initializeChats() {
  console.log("Initializing chats");
  try {
    const status = await getAllChats(accessToken);
    if (status === 200) {
      const chats = JSON.parse(localStorage.getItem('chats') || '[]');
      if (chats.length > 0) {
        // Render chats in UI
        const chatList = document.querySelector('.chat-list'); // Assumes a container for chat items
        chatList.innerHTML = '';
        chats.forEach(chat => {
          const chatItem = document.createElement('div');
          chatItem.className = `chat-item ${chat.status === 'closed' ? 'closed' : ''}`;
          chatItem.setAttribute('data-chat-id', chat.idChat);
          chatItem.innerHTML = `
            <div>
              <p>${chat.idUser2}</p> <!-- Adjust to display user name if available -->
              <small>Última mensagem: ${chat.createdIn}</small>
              ${chat.unread > 0 ? `<span class="unread-count">${chat.unread}</span>` : ''}
            </div>
          `;
          chatItem.addEventListener('click', () => selectChat(chat.idChat));
          chatList.appendChild(chatItem);
        });
        // Select the first chat by default
        if (chats.length > 0) {
          selectChat(chats[0].idChat);
        } else {
          document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
          document.getElementById('chat-messages').innerHTML = '<p>Nenhum chat disponível.</p>';
        }
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
      document.getElementById('chat-user-name').textContent = chat.idUser2 || 'Chat sem nome';

      // Fetch messages for the chat
      const messagesStatus = await getAllMessages(accessToken, chatId);
      if (messagesStatus === 200) {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = ''; // Clear existing messages

        messages.forEach(msg => {
          const messageDiv = document.createElement('div');
          messageDiv.className = `message ${msg.idUser === chat.idUser ? 'received' : 'sent'}`; // Assumes idUser determines sender
          messageDiv.innerHTML = `<p>${msg.description}</p><small>${new Date(msg.createdIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>`;
          chatMessages.appendChild(messageDiv);
        });

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        document.getElementById('chat-messages').innerHTML = '<p>Erro ao carregar mensagens.</p>';
      }
    } else {
      document.getElementById('chat-user-name').textContent = 'Nenhum chat selecionado';
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
            chatMessages.innerHTML = '';
  
            messages.forEach(msg => {
              const messageDiv = document.createElement('div');
              messageDiv.className = `message ${msg.idUser === JSON.parse(localStorage.getItem('chat')).idUser ? 'received' : 'sent'}`;
              messageDiv.innerHTML = `<p píxel><small>${new Date(msg.createdIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>`;
              chatMessages.appendChild(messageDiv);
            });
  
            // Clear input
            input.value = '';
  
            // Scroll to the bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
  
            // Update notifications
            updateNotifications(`Nova mensagem enviada no chat ${currentChatId}`);
          } else {
            console.warn("Failed to send message, status:", status);
          }
        }
      } catch (error) {
        console.error("Error sending message:", error.message, error.stack);
      }
    }
}

async function closeChat() {
  if (currentChatId) {
    const chat = JSON.parse(localStorage.getItem('chat') || '{}');
    document.getElementById('close-chat-message').textContent = `Tem certeza que deseja fechar o chat com ${chat.idUser2}?`;
    openModal('close-chat-modal');
  }
}

async function confirmCloseChat() {
  if (currentChatId) {
    try {
      // Assuming closing a chat means updating its status via API
      const chatData = {
        idChat: currentChatId,
        status: 'closed' // Assuming the API accepts a status field
      };
      const status = await updateChat(accessToken, chatData);
      if (status === 200) {
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
        updateNotifications(`Chat com ${chat.idUser2} fechado`);

        // Refresh chat list
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
    document.getElementById('delete-chat-message').textContent = `Tem certeza que deseja excluir o chat com ${chat.idUser2}? Esta ação é irreversível.`;
    openModal('delete-chat-modal');
  }
}

async function confirmDeleteChat() {
  if (currentChatId) {
    try {
      const status = await deleteChat(accessToken, currentChatId);
      if (status === 200) {
        // Remove chat from UI
        const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
        if (chatItem) {
          chatItem.remove();
        }

        // Update notifications
        updateNotifications(`Chat com ${JSON.parse(localStorage.getItem('chat')).idUser2} excluído`);

        // Select another chat or clear window
        const remainingChats = JSON.parse(localStorage.getItem('chats') || '[]');
        if (remainingChats.length > 0) {
          const newChatId = remainingChats[0].idChat;
          selectChat(newChatId);
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