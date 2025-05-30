     // Funções específicas para a página de serviços
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
            document.querySelector('.overlay').style.display = 'block';
            
            // Se for o modal de agendamento, seta a data mínima para hoje
            if (modalId === 'schedule-modal') {
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('schedule-date').min = today;
            }
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.querySelector('.overlay').style.display = 'none';
        }
        
        function confirmSchedule() {
            closeModal('schedule-modal');
            openModal('confirmation-modal');
            
            // Aqui você enviaria os dados do agendamento para o servidor
            // const service = ...
            // const date = ...
            // const time = ...
            // const professional = ...
            // const notes = ...
        }
        
        // Filtro por categoria
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // Aqui você filtraria os serviços por categoria
                const category = this.textContent.trim();
                console.log('Filtrando por categoria:', category);
            });
        });
        
        // Paginação
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('active') || this.classList.contains('next')) return;
                
                document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // Aqui você carregaria a página correspondente
                const page = this.textContent.trim();
                console.log('Carregando página:', page);
            });
        });
        
        // Fecha modais ao clicar no overlay
        document.querySelector('.overlay').addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            this.style.display = 'none';
        });