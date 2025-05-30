 // Funções para os modais
        function openModal(id) {
            document.getElementById(id).style.display = 'block';
            document.querySelector('.overlay').style.display = 'block';
        }

        function closeModal(id) {
            document.getElementById(id).style.display = 'none';
            document.querySelector('.overlay').style.display = 'none';
        }

        // Dropdown do usuário
        document.querySelector('.user-profile').addEventListener('click', function() {
            this.querySelector('.dropdown-content').classList.toggle('show');
        });

        // Fechar dropdowns ao clicar fora
        window.onclick = function(event) {
            if (!event.target.matches('.user-profile') && !event.target.matches('.user-profile *')) {
                var dropdowns = document.querySelectorAll('.dropdown-content');
                dropdowns.forEach(function(dropdown) {
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    }
                });
            }
        }

        // Menu toggle para mobile
        document.querySelector('.menu-toggle').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
            document.querySelector('.overlay').style.display = 
                document.querySelector('.overlay').style.display === 'block' ? 'none' : 'block';
        });

        // Fechar sidebar ao clicar no overlay
        document.querySelector('.overlay').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.remove('active');
            this.style.display = 'none';
        });

document.querySelector('.close-sidebar').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('.overlay').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const notificationIcon = document.querySelector('.notification-icon');
    const cartIcon = document.querySelector('.cart-icon');
    const userProfile = document.querySelector('.user-profile');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    // Funções para abrir/fechar modais
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Atribuir funções globais
    window.openModal = openModal;
    window.closeModal = closeModal;
    
    // Event listeners para dropdowns
    notificationIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationsDropdown.classList.toggle('active');
        cartDropdown.classList.remove('active');
        dropdownContent.classList.remove('active');
    });
    
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
        notificationsDropdown.classList.remove('active');
        dropdownContent.classList.remove('active');
    });
    
    userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('active');
        notificationsDropdown.classList.remove('active');
        cartDropdown.classList.remove('active');
    });
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function() {
        notificationsDropdown.classList.remove('active');
        cartDropdown.classList.remove('active');
        dropdownContent.classList.remove('active');
    });
    
    // Impedir que dropdowns fechem ao clicar neles
    notificationsDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    cartDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    dropdownContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Sidebar toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Fechar modais ao clicar no overlay
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Remover itens do carrinho
    document.querySelectorAll('.cart-item i.fa-times').forEach(icon => {
        icon.addEventListener('click', function() {
            this.closest('.cart-item').remove();
            // Atualizar contador do carrinho
            const count = document.querySelectorAll('.cart-item').length - 1; // -1 porque o total não conta
            document.querySelector('.cart-count').textContent = count;
        });
    });
});