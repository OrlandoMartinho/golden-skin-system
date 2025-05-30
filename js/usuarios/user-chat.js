    // Função para abrir o chat
        function openChat(chatId) {
            document.getElementById('chat-window').style.display = 'flex';
            document.querySelector('.chat-list').style.display = 'none';
            
            // Simulação de carregamento de chat diferente
            if(chatId === 1) {
                document.getElementById('chat-name').textContent = 'Ana Silva - Massagista';
                document.getElementById('chat-status').textContent = 'Online';
                document.getElementById('chat-avatar').src = '../../assets/img/Elipse 51.png';
                
                // Limpar mensagens existentes
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="message received">
                        <div class="message-content">
                            Olá, como posso ajudar você hoje?
                        </div>
                        <div class="message-time">10:30</div>
                    </div>
                    
                    <div class="message sent">
                        <div class="message-content">
                            Olá Ana, gostaria de confirmar meu horário de amanhã
                        </div>
                        <div class="message-time">10:32</div>
                    </div>
                    
                    <div class="message received">
                        <div class="message-content">
                            Seu horário está confirmado para amanhã às 14h. Poderia chegar 10 minutos antes?
                        </div>
                        <div class="message-time">10:33</div>
                    </div>
                    
                    <div class="message sent">
                        <div class="message-content">
                            Claro, sem problemas! Obrigado pela confirmação.
                        </div>
                        <div class="message-time">10:35</div>
                    </div>
                `;
            } else if(chatId === 2) {
                document.getElementById('chat-name').textContent = 'Carlos Mendes - Esteticista';
                document.getElementById('chat-status').textContent = 'Online há 2h';
                document.getElementById('chat-avatar').src = 'https://via.placeholder.com/50/0000FF/FFFFFF';
                
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="message received">
                        <div class="message-content">
                            Bom dia! Seu produto já está disponível para retirada.
                        </div>
                        <div class="message-time">09:15</div>
                    </div>
                    
                    <div class="message sent">
                        <div class="message-content">
                            Ótimo! Posso passar amanhã no período da tarde?
                        </div>
                        <div class="message-time">09:20</div>
                    </div>
                    
                    <div class="message received">
                        <div class="message-content">
                            Sim, estamos abertos das 10h às 18h. Não esqueça de trazer seu comprovante.
                        </div>
                        <div class="message-time">09:22</div>
                    </div>
                `;
            }
            
            // Rolagem para baixo
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Função para fechar o chat
        function closeChat() {
            document.getElementById('chat-window').style.display = 'none';
            document.querySelector('.chat-list').style.display = 'block';
        }
        
        // Função para enviar mensagem
        function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if(message) {
                const messagesContainer = document.getElementById('chat-messages');
                
                // Adiciona a nova mensagem
                const newMessage = document.createElement('div');
                newMessage.className = 'message sent';
                newMessage.innerHTML = `
                    <div class="message-content">${message}</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                
                messagesContainer.appendChild(newMessage);
                input.value = '';
                
                // Simula resposta após 1 segundo
                setTimeout(() => {
                    const replyMessage = document.createElement('div');
                    replyMessage.className = 'message received';
                    replyMessage.innerHTML = `
                        <div class="message-content">Obrigado pela sua mensagem. Responderei em breve.</div>
                        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    `;
                    messagesContainer.appendChild(replyMessage);
                    
                    // Rolagem para baixo
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 1000);
                
                // Rolagem para baixo
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
        
        // Permitir enviar mensagem com Enter
        document.getElementById('message-input').addEventListener('keypress', function(e) {
            if(e.key === 'Enter') {
                sendMessage();
            }
        });