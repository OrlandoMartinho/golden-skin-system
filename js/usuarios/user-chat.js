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
            document.getElementById('chat-avatar').src = '../../assets/img/Elipse 51.png';
            
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
        // messagesContainer.scrollTop = messagesContainer.scrollHeight;
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


        // Adicionando funcionalidade de gravação de áudio
        document.addEventListener('DOMContentLoaded', function() {
            const recordButton = document.getElementById('record-button');
            const stopButton = document.getElementById('stop-button');
            const playButton = document.getElementById('play-button');
            const sendAudioButton = document.getElementById('send-audio-button');
            const cancelAudioButton = document.getElementById('cancel-audio-button');
            
            let mediaRecorder;
            let audioChunks = [];
            let audioBlob;
            let audioUrl;
            
            recordButton.addEventListener('click', async function() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);
                    
                    mediaRecorder.ondataavailable = function(e) {
                        if (e.data.size > 0) {
                            audioChunks.push(e.data);
                        }
                    };
                    
                    mediaRecorder.onstop = function() {
                        audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                        audioUrl = URL.createObjectURL(audioBlob);
                        
                        // Mostrar botões de controle
                        playButton.style.display = 'inline-block';
                        sendAudioButton.style.display = 'inline-block';
                        cancelAudioButton.style.display = 'inline-block';
                    };
                    
                    mediaRecorder.start();
                    audioChunks = [];
                    
                    // Mostrar botão de parar e esconder o de gravar
                    recordButton.style.display = 'none';
                    stopButton.style.display = 'inline-block';
                    
                } catch (error) {
                    console.error('Erro ao acessar o microfone:', error);
                    alert('Não foi possível acessar o microfone. Por favor, verifique as permissões.');
                }
            });
            
            stopButton.addEventListener('click', function() {
                mediaRecorder.stop();
                stopButton.style.display = 'none';
                
                // Parar todas as tracks do stream
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            });
            
            playButton.addEventListener('click', function() {
                const audioPreview = new Audio(audioUrl);
                audioPreview.play();
            });
            
            sendAudioButton.addEventListener('click', function() {
                // Aqui você implementaria o envio do áudio para o servidor
                // Por enquanto, apenas simularemos adicionando uma mensagem de áudio ao chat
                const chatMessages = document.getElementById('chat-messages');
                
                const audioMessage = document.createElement('div');
                audioMessage.className = 'message sent audio-message';
                audioMessage.innerHTML = `
                    <div class="message-content">
                        <audio controls>
                            <source src="${audioUrl}" type="audio/mp3">
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                        <div class="audio-duration">0:45</div>
                    </div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                
                chatMessages.appendChild(audioMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Resetar a interface
                resetAudioInterface();
            });
            
            cancelAudioButton.addEventListener('click', function() {
                // Parar a gravação se estiver em andamento
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                    mediaRecorder.stream.getTracks().forEach(track => track.stop());
                }
                
                // Resetar a interface
                resetAudioInterface();
            });
            
            function resetAudioInterface() {
                recordButton.style.display = 'inline-block';
                stopButton.style.display = 'none';
                playButton.style.display = 'none';
                sendAudioButton.style.display = 'none';
                cancelAudioButton.style.display = 'none';
                
                // Limpar dados da gravação
                audioChunks = [];
                audioBlob = null;
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                    audioUrl = null;
                }
            }
        });
