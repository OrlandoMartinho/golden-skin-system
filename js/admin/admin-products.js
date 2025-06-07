// === Image Preview Handler ===
document.getElementById('service-photo').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photo-preview');

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
        showMessageModal('error', 'Erro!', 'Por favor, selecione uma imagem válida (JPEG ou PNG).', { buttonText: 'Entendido' });
    }
});

// === Main Application Logic ===
document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    let servicesData = [];

    // === Initialize Services ===
    async function initializeServices() {
        try {
            const result = await getAllServices(accessToken);

            if (result === 200) {
                const storedServices = localStorage.getItem('services');
                servicesData = storedServices ? JSON.parse(storedServices) : [];
                populateServicesTable(servicesData);
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar serviços', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Falha ao inicializar a aplicação', { buttonText: 'Entendido' });
        }
    }

    // === Populate Services Table ===
    function populateServicesTable(services) {
        const tbody = document.querySelector('.services-table tbody');
        if (!tbody) {
            return;
        }

        tbody.innerHTML = '';
        services.forEach((service) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.photo ? `<img src="${service.photo}" alt="${service.name}" style="max-width: 50px; max-height: 50px;">` : '-'}</td>
                <td>${service.name || '-'}</td>
                <td>${service.category || '-'}</td>
                <td>${((service.priceInCents || 0) / 100).toFixed(2)}</td>
                <td>${service.duration || '-'}</td>
                <td><span class="status-${service.status ? 'active' : 'inactive'}">${service.status ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="action-btn" onclick="editService(${service.idService})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteService(${service.idService})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // === Modal Control Functions ===
    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    window.confirmAction = async function () {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');
        const action = messageElement.dataset.action;
        const confirmButton = document.getElementById('confirm-button');
        
        // Adiciona loader ao botão de confirmação
        const originalConfirmText = confirmButton.innerHTML;
        confirmButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        confirmButton.disabled = true;

        if (action.startsWith('deleteService-')) {
            const serviceId = parseInt(action.split('-')[1]);
            try {
                const result = await deleteService(accessToken, serviceId);
                if (result === 200) {
                    servicesData = servicesData.filter((s) => s.idService !== serviceId);
                    populateServicesTable(servicesData);
                    showMessageModal('success', 'Sucesso!', 'Serviço eliminado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao excluir o serviço', { buttonText: 'Entendido' });
                }
            } catch (error) {
                showMessageModal('error', 'Erro!', 'Ocorreu um erro ao excluir o serviço', { buttonText: 'Entendido' });
            }
        }
        
        // Restaura o botão de confirmação
        confirmButton.innerHTML = originalConfirmText;
        confirmButton.disabled = false;
        modal.classList.remove('active');
    };

    // === Service Modal Functions ===
    window.openAddServiceModal = function () {
        const modal = document.getElementById('service-modal');
        const form = document.getElementById('service-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) {
            return;
        }

        title.textContent = 'Adicionar Serviço';
        form.reset();
        const preview = document.getElementById('photo-preview');
        preview.src = '#';
        preview.style.display = 'none';
        modal.classList.add('active');
    };

    window.editService = async function (serviceId) {
        const modal = document.getElementById('service-modal');
        const form = document.getElementById('service-form');
        const title = document.getElementById('modal-title');

        if (!modal || !form || !title) {
            return;
        }

        try {
            const result = await getService(accessToken, serviceId);
            if (result === 200) {
                const service = JSON.parse(localStorage.getItem('service'));
                if (service) {
                    title.textContent = 'Editar Serviço';
                    document.getElementById('service-name').value = service.name || '';
                    document.getElementById('service-category').value = service.category || '';
                    document.getElementById('service-price').value = ((service.priceInCents || 0) / 100).toFixed(2);
                    document.getElementById('service-duration').value = service.duration || 0;
                    document.getElementById('service-benefits').value = service.benefits || '';
                    document.getElementById('service-reviews').value = service.reviews || '';
                    document.getElementById('service-status').value = service.status ? 'active' : 'inactive';
                    form.dataset.serviceId = service.idService;

                    const preview = document.getElementById('photo-preview');
                    if (service.photo) {
                        preview.src = service.photo;
                        preview.style.display = 'block';
                    } else {
                        preview.src = '#';
                        preview.style.display = 'none';
                    }
                    
                    modal.classList.add('active');
                } else {
                    showMessageModal('error', 'Erro!', 'Serviço não encontrado', { buttonText: 'Entendido' });
                }
            } else {
                showMessageModal('error', 'Erro!', 'Falha ao carregar o serviço', { buttonText: 'Entendido' });
            }
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao carregar o serviço', { buttonText: 'Entendido' });
        }
    };

    window.deleteService = function (serviceId) {
        showConfirmModal(`Tem certeza que deseja excluir o serviço ${serviceId}?`, `deleteService-${serviceId}`);
    };

    // === Form Submission Handler ===
    document.getElementById('service-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Adiciona loader
        submitButton.innerHTML = `<span class="button-loader"></span>Processando...`;
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;

        const serviceId = parseInt(e.target.dataset.serviceId) || null;
        const name = document.getElementById('service-name').value.trim();
        const category = document.getElementById('service-category').value.trim();
        const price = parseFloat(document.getElementById('service-price').value);
        const duration = parseInt(document.getElementById('service-duration').value);
        const benefits = document.getElementById('service-benefits').value.trim();
        const reviews = document.getElementById('service-reviews').value.trim();
        const status = document.getElementById('service-status').value === 'active';

        // Validação
        if (!name || !category || isNaN(price) || isNaN(duration)) {
            showMessageModal('error', 'Erro!', 'Por favor, preencha todos os campos obrigatórios.', {
                buttonText: 'Entendido',
            });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        if (price < 0) {
            showMessageModal('error', 'Erro!', 'O preço não pode ser negativo.', { buttonText: 'Entendido' });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        if (duration < 1) {
            showMessageModal('error', 'Erro!', 'A duração deve ser maior que 0 minutos.', { buttonText: 'Entendido' });
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
            return;
        }

        const serviceData = {
            name,
            description: name,
            priceInCents: Math.round(price * 100),
            status,
            category,
            duration,
            benefits,
            reviews,
        };

        try {
            if (serviceId) {
                // Atualizar serviço existente
                serviceData.idService = serviceId;
                const fileInput = document.getElementById('service-photo');
                const file = fileInput.files[0];
                const response = await editService(accessToken, serviceData, file);
                if (response === 200) {
                    const index = servicesData.findIndex((s) => s.idService === serviceId);
                    if (index !== -1) {
                        servicesData[index] = {
                            ...servicesData[index],
                            ...serviceData,
                            updatedIn: new Date().toISOString(),
                        };
                        populateServicesTable(servicesData);
                        showMessageModal('success', 'Sucesso!', 'Serviço atualizado com sucesso', { buttonText: 'Ótimo!' });
                    }
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao atualizar o serviço', { buttonText: 'Entendido' });
                }
            } else {
                // Adicionar novo serviço
                const fileInput = document.getElementById('service-photo');
                const file = fileInput.files[0];
                const response = await addService(accessToken, serviceData, file);
                
                if (response === 200) {
                    await getAllServices(accessToken);
                    servicesData = JSON.parse(localStorage.getItem('services')) || [];
                    populateServicesTable(servicesData);
                    showMessageModal('success', 'Sucesso!', 'Serviço criado com sucesso', { buttonText: 'Ótimo!' });
                } else {
                    showMessageModal('error', 'Erro!', 'Falha ao criar o serviço', { buttonText: 'Entendido' });
                }
            }
            closeModal('service-modal');
            e.target.dataset.serviceId = '';
        } catch (error) {
            showMessageModal('error', 'Erro!', 'Ocorreu um erro ao processar o serviço', { buttonText: 'Entendido' });
        } finally {
            // Restaura o botão
            submitButton.innerHTML = originalButtonText;
            submitButton.classList.remove('button-loading');
            submitButton.disabled = false;
        }
    });

    // === Search and Filter Functionality ===
    const searchInput = document.getElementById('service-search');
    const statusFilter = document.getElementById('service-status-filter');
    const categoryFilter = document.getElementById('service-category-filter');

    function filterServices() {
        if (!searchInput || !statusFilter || !categoryFilter) {
            return;
        }

        const search = searchInput.value.toLowerCase().trim();
        const statusFilterValue = statusFilter.value;
        const categoryFilterValue = categoryFilter.value;

        const filteredServices = servicesData.filter((service) => {
            const matchesSearch = (service.name || '').toLowerCase().includes(search);
            const matchesStatus =
                statusFilterValue === 'all' ||
                (statusFilterValue === 'active' && service.status) ||
                (statusFilterValue === 'inactive' && !service.status);
            const matchesCategory =
                categoryFilterValue === 'all' || (service.category || '').toLowerCase() === categoryFilterValue.toLowerCase();
            return matchesSearch && matchesStatus && matchesCategory;
        });
        populateServicesTable(filteredServices);
    }

    // Event listeners para filtros
    if (searchInput) {
        searchInput.addEventListener('input', filterServices);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterServices);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterServices);
    }

    // === Helper Functions ===
    function showConfirmModal(message, action) {
        const modal = document.getElementById('confirm-modal');
        const messageElement = document.getElementById('confirm-message');

        if (!modal || !messageElement) {
            return;
        }

        messageElement.textContent = message;
        messageElement.dataset.action = action;
        modal.classList.add('active');
    }

    // Inicializa os serviços ao carregar
    await initializeServices();
});

// === Tab Navigation ===
function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// === Plan Modal Functions ===
function openAddPlanModal() {
    document.getElementById('plan-modal').style.display = 'block';
    document.getElementById('plan-modal-title').textContent = 'Adicionar Plano';
    document.getElementById('plan-form').reset();
}

function editPlan(id) {
    document.getElementById('plan-modal').style.display = 'block';
    document.getElementById('plan-modal-title').textContent = 'Editar Plano';
}

function deletePlan(id) {
    document.getElementById('confirm-modal').style.display = 'block';
    document.getElementById('confirm-message').textContent = 'Tem certeza que deseja excluir este plano?';
    document.getElementById('confirm-modal').dataset.planId = id;
}