document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let servicesData = [];
    let userData = {};

    async function initializeData() {
        try {
            // Initialize User Info
            userData = JSON.parse(localStorage.getItem('user')) || {};
            document.getElementById('user-name').textContent = userData.name || 'Usuário';
            document.getElementById('schedule-name').value = userData.name || '';
            document.getElementById('schedule-email').value = userData.email || '';
            document.getElementById('schedule-phone').value = userData.phoneNumber || '';

            // Initialize Services
            const servicesResult = await getAllServices(accessToken);
            if (servicesResult === 200) {
                servicesData = JSON.parse(localStorage.getItem('services')) || [];
                populateServicesSection(servicesData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar serviços', { buttonText: 'Entendido' });
            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a página', { buttonText: 'Entendido' });
        }
    }

    function populateServicesSection(services) {
        const section = document.querySelector('.section-services');
        if (!section) return;

        section.innerHTML = '';
        if (services.length === 0) {
            section.innerHTML = '<p>Nenhum serviço encontrado.</p>';
            return;
        }

        services.forEach(service => {
            const card = document.createElement('div'); // Initialize card here
            card.classList.add('service-card');
            const rating = calculateRating(service.rating || 0);
            card.innerHTML = `
                <div class="service-image">
                    <img src="${service.photo || '../../assets/img/placeholder.png'}" alt="${service.name}">
                </div>
                <div class="service-info">
                    <h3>${service.name || '-'}</h3>
                    <div class="rating">
                        ${rating.stars}
                        <span>(${service.reviews || 0})</span>
                    </div>
                    <div class="price">AOA ${(service.priceInCents / 100).toFixed(2)}</div>
                    <div class="service-actions">
                        <button class="view-more" onclick="openDetailsModal(${service.idService})">
                            <i class="fas fa-eye"></i> Ver Mais
                        </button>
                        <button class="schedule-service" onclick="openScheduleModal(${service.idService})">
                            <i class="fas fa-calendar-alt"></i> Agendar
                        </button>
                    </div>
                </div>
            `;
            section.appendChild(card);
        });
    }

    function calculateRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return { stars, rating };
    }

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };

    window.openDetailsModal = function(idService) {
        const modal = document.getElementById('details-modal');
        const service = servicesData.find(s => s.idService === idService);
        if (modal && service) {
            document.getElementById('details-image').src = service.photo || '../../assets/img/placeholder.png';
            document.getElementById('details-name').textContent = service.name || '-';
            document.getElementById('details-rating').innerHTML = calculateRating(service.rating || 0).stars + `<span>(${service.reviews || 0})</span>`;
            document.getElementById('details-price').textContent = `AOA ${(service.priceInCents / 100).toFixed(2)}`;
            document.getElementById('details-description').textContent = service.description || 'Sem descrição disponível';
            document.getElementById('details-duration').textContent = service.duration || '-';
            document.getElementById('details-category').textContent = service.category || '-';
            document.getElementById('details-updated').textContent = service.updatedIn ? new Date(service.updatedIn).toLocaleDateString('pt-BR') : '-';
            const benefitsList = document.getElementById('details-benefits');
            benefitsList.innerHTML = '';
            ((service.benefits).split(",") || []).forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });
            modal.dataset.idService = idService;
            modal.classList.add('active');
        }
    };

    window.openScheduleModal = function(idService) {
        const modal = document.getElementById('schedule-modal');
        const form = document.getElementById('schedule-form');
        if (modal && form) {
            form.dataset.idService = idService;
            modal.classList.add('active');
        }
    };

    window.goToAppointments = function() {
        window.location.href = 'user-home.html';
    };

    window.scheduleFromDetails = function() {
        const modal = document.getElementById('details-modal');
        const idService = parseInt(modal.dataset.idService);
        openScheduleModal(idService);
        closeModal('details-modal');
    };

    document.getElementById('schedule-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.disabled = true;

        const idService = parseInt(form.dataset.idService);
        const name = document.getElementById('schedule-name').value.trim();
        const email = document.getElementById('schedule-email').value.trim();
        const phoneNumber = document.getElementById('schedule-phone').value.trim();
        const appointmentDate = document.getElementById('schedule-date').value;
        const appointmentTime = document.getElementById('schedule-time').value;
        const status = true;

        if (!name || !email || !phoneNumber || !appointmentDate || !appointmentTime || !idService) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', { buttonText: 'Entendido' });
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }

        const appointmentData = {
            name,
            email,
            phoneNumber,
            appointmentDate,
            appointmentTime,
            idService,
            status
        };

        try {
            const response = await addAnyAppointment(accessToken, appointmentData);
            if (response.status === 200) {
                closeModal('schedule-modal');
                openModal('schedule-success-modal');
                form.reset();
                document.getElementById('schedule-name').value = userData.name || '';
                document.getElementById('schedule-email').value = userData.email || '';
                document.getElementById('schedule-phone').value = userData.phoneNumber || '';
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao agendar o serviço', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o agendamento', { buttonText: 'Entendido' });
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    function filterServices() {
        const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
        const categoryFilter = document.getElementById('category-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        let filteredServices = servicesData.filter(service => {
            const matchesSearch = (service.name || '').toLowerCase().includes(searchInput) ||
                                 (service.description || '').toLowerCase().includes(searchInput);
            const matchesCategory = categoryFilter === 'all' || (service.category || '').toLowerCase() === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        if (sortFilter !== 'default') {
            filteredServices.sort((a, b) => {
                if (sortFilter === 'price-asc') return a.priceInCents - b.priceInCents;
                if (sortFilter === 'price-desc') return b.priceInCents - a.priceInCents;
                if (sortFilter === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
                if (sortFilter === 'newest') return new Date(b.updatedIn) - new Date(a.updatedIn);
                return 0;
            });
        }

        populateServicesSection(filteredServices);
    }

    document.getElementById('search-input').addEventListener('input', filterServices);
    document.getElementById('category-filter').addEventListener('change', filterServices);
    document.getElementById('sort-filter').addEventListener('change', filterServices);

    await initializeData();
});