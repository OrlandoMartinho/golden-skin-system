/**
 * user-service.js
 * Scripts para a página de serviços (Pele Douro)
 * Funcionalidades: controle de modais, filtros, sidebar, notificações, carrinho e perfil
 */

// Função para abrir um modal pelo ID
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Impede rolagem da página
    }
}

// Função para fechar um modal pelo ID
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaura rolagem da página
    }
}

// Função para confirmar o agendamento
function confirmSchedule() {
    const service = document.getElementById('service-selected').value;
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    const professional = document.getElementById('professional').value;
    const observations = document.getElementById('observations').value;

    // Validação básica
    if (!date || !time) {
        alert('Por favor, selecione uma data e horário.');
        return;
    }

    // Aqui você pode adicionar lógica para enviar os dados do agendamento ao backend
    console.log('Agendamento confirmado:', {
        service,
        date,
        time,
        professional,
        observations
    });

    closeModal('schedule-modal');
    openModal('confirmation-modal');
}

// Manipulação da sidebar
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.add('active');
    document.querySelector('.overlay').style.display = 'block';
});

document.querySelector('.close-sidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('.overlay').style.display = 'none';
});

document.querySelector('.overlay').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('.overlay').style.display = 'none';
});

// Manipulação do dropdown de notificações
document.querySelector('.notification-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.querySelector('.notifications-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    document.querySelector('.cart-dropdown').style.display = 'none'; // Fecha o carrinho
    document.querySelector('.dropdown-content').style.display = 'none'; // Fecha o perfil
});

// Manipulação do dropdown do carrinho
document.querySelector('.cart-icon').addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.querySelector('.cart-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    document.querySelector('.notifications-dropdown').style.display = 'none'; // Fecha notificações
    document.querySelector('.dropdown-content').style.display = 'none'; // Fecha o perfil
});

// Manipulação do dropdown de perfil
document.querySelector('.user-profile').addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    document.querySelector('.notifications-dropdown').style.display = 'none'; // Fecha notificações
    document.querySelector('.cart-dropdown').style.display = 'none'; // Fecha o carrinho
});

// Fechar dropdowns ao clicar fora
document.addEventListener('click', () => {
    document.querySelector('.notifications-dropdown').style.display = 'none';
    document.querySelector('.cart-dropdown').style.display = 'none';
    document.querySelector('.dropdown-content').style.display = 'none';
});

// Manipulação da pesquisa
document.querySelector('.search-box input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const services = document.querySelectorAll('.service-card');
    services.forEach(service => {
        const title = service.querySelector('h3').textContent.toLowerCase();
        service.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// Manipulação do filtro de categoria
document.querySelector('.filter-dropdown select[aria-label="Filtrar por categoria"]').addEventListener('change', (e) => {
    const category = e.target.value;
    const services = document.querySelectorAll('.service-card');
    services.forEach(service => {
        // Adicione um atributo data-category ao HTML dos cartões para filtragem
        // Exemplo: data-category="facial" no elemento .service-card
        const serviceCategory = service.dataset.category || '';
        service.style.display = !category || serviceCategory === category ? 'block' : 'none';
    });
});

// Manipulação do filtro de ordenação
document.querySelector('.filter-dropdown select[aria-label="Ordenar serviços"]').addEventListener('change', (e) => {
    const sortBy = e.target.value;
    const servicesContainer = document.querySelector('.section-services');
    const services = Array.from(document.querySelectorAll('.service-card'));

    if (sortBy === 'preco-asc') {
        services.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.'));
            const priceB = parseFloat(b.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.'));
            return priceA - priceB;
        });
    } else if (sortBy === 'preco-desc') {
        services.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.'));
            const priceB = parseFloat(b.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.'));
            return priceB - priceA;
        });
    } else if (sortBy === 'popular') {
        services.sort((a, b) => {
            const ratingA = parseInt(a.querySelector('.rating span').textContent.replace(/[^0-9]/g, ''));
            const ratingB = parseInt(b.querySelector('.rating span').textContent.replace(/[^0-9]/g, ''));
            return ratingB - ratingA;
        });
    } else if (sortBy === 'duracao') {
        services.sort((a, b) => {
            const durationA = a.querySelector('.service-meta span').textContent.match(/(\d+ min|\d+ horas)/)[0];
            const durationB = b.querySelector('.service-meta span').textContent.match(/(\d+ min|\d+ horas)/)[0];
            const minutesA = durationA.includes('horas') ? parseInt(durationA) * 60 : parseInt(durationA);
            const minutesB = durationB.includes('horas') ? parseInt(durationB) * 60 : parseInt(durationB);
            return minutesA - minutesB;
        });
    }

    servicesContainer.innerHTML = '';
    services.forEach(service => servicesContainer.appendChild(service));
});

// Manipulação dos botões de remoção do carrinho
document.querySelectorAll('.cart-item button').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.cart-item');
        item.remove();
        updateCartCount();
    });
});

// Função para atualizar a contagem do carrinho
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item').length;
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cartItems;
    cartCount.style.display = cartItems > 0 ? 'block' : 'none';
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    // Adicione data-category aos cartões de serviço para filtragem
    // Exemplo: você pode fazer isso dinamicamente com base nos dados do backend
    document.querySelectorAll('.service-card').forEach((card, index) => {
        const categories = ['facial', 'corporal', 'spa', 'esteticos', 'corporal', 'spa'];
        card.dataset.category = categories[index % categories.length];
    });
});