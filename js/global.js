// Funções globais para manipulação de modais e dropdowns
document.addEventListener('DOMContentLoaded', function() {
    // Elementos globais do DOM
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

    // Função para abrir modais
    window.openModal = function(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                overlay?.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Erro ao abrir modal:', error);
        }
    };

    // Função para fechar modais
    window.closeModal = function(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                overlay?.classList.remove('active');
                document.body.style.overflow = '';
            }
        } catch (error) {
            console.error('Erro ao fechar modal:', error);
        }
    };

    // Configuração dos dropdowns
    function setupDropdowns() {
        // Dropdown de notificações
        if (notificationIcon && notificationsDropdown) {
            notificationIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                notificationsDropdown.classList.toggle('active');
                cartDropdown?.classList.remove('active');
                dropdownContent?.classList.remove('show'); // Alterado para 'show' para consistência
            });
        }

        // Dropdown do carrinho
        if (cartIcon && cartDropdown) {
            cartIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                cartDropdown.classList.toggle('active');
                notificationsDropdown?.classList.remove('active');
                dropdownContent?.classList.remove('show');
            });
        }

        // Dropdown do perfil do usuário (usando a função específica)
        setupUserProfileDropdown();

        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', function() {
            notificationsDropdown?.classList.remove('active');
            cartDropdown?.classList.remove('active');
            dropdownContent?.classList.remove('show');
        });

        // Impedir que dropdowns fechem ao clicar neles
        notificationsDropdown?.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        cartDropdown?.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        dropdownContent?.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Função específica para o dropdown do user-profile
    function setupUserProfileDropdown() {
        const userProfile = document.querySelector('.user-profile');
        const dropdownContent = userProfile?.querySelector('.dropdown-content');

        if (userProfile && dropdownContent) {
            userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownContent.classList.toggle('show');
                
                // Fecha outros dropdowns abertos
                document.querySelectorAll('.notifications-dropdown, .cart-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            });

            // Fecha ao clicar fora
            document.addEventListener('click', function() {
                dropdownContent.classList.remove('show');
            });

            // Impede que feche ao clicar dentro
            dropdownContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // Gerenciamento da sidebar mobile
    function setupSidebar() {
        if (menuToggle && sidebar && overlay) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            });
        }

        if (closeSidebar && sidebar && overlay) {
            closeSidebar.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }

        if (overlay && sidebar) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
    }

    // Fechar modais ao clicar no overlay
    function setupModalClose() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this.id);
                }
            });
        });
    }

    // Inicialização
    try {
        setupDropdowns();
        setupSidebar();
        setupModalClose();
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});